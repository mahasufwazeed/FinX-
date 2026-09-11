import { Request, Response } from 'express';
import { authDb, dealsDb } from '../db';
import crypto from 'crypto';

export const getDeals = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const deals = await dealsDb.project.findMany({
            where: {
                OR: [
                    { buyerId: userId },
                    { sellerId: userId }
                ]
            },
            include: { milestones: true }
        });
        res.json(deals);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const deal = await dealsDb.project.findUnique({
            where: { id: String(req.params.id) },
            include: { milestones: true }
        });

        if (!deal) {
            res.status(404).json({ message: 'Deal not found' });
            return;
        }

        if (deal.buyerId !== userId && deal.sellerId !== userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        res.json(deal);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createDeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyerId = (req as any).user?.id;
        const { title, description, sellerId, totalAmount, currency = 'USD' } = req.body;

        const dealer = await authDb.user.findUnique({ where: { id: sellerId } });
        if (!dealer || (dealer.role !== 'SELLER' && dealer.role !== 'VENDOR')) {
            res.status(400).json({ message: 'Invalid vendor assigned' });
            return;
        }

        const project = await dealsDb.project.create({
            data: {
                title,
                description,
                buyerId,
                sellerId,
                totalAmount: Number(totalAmount),
                currency,
                status: 'PENDING_ACCEPTANCE'
            }
        });

        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSellers = async (req: Request, res: Response): Promise<void> => {
    try {
        const sellers = await authDb.user.findMany({
            where: {
                OR: [
                    { role: 'SELLER' },
                    { role: 'VENDOR' }
                ]
            },
            select: { id: true, email: true, fullName: true, role: true }
        });

        res.json(sellers.map(s => ({ ...s, name: s.fullName })));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const acceptDeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const dealId = String(req.params.id);

        const deal = await dealsDb.project.findUnique({ where: { id: dealId } });

        if (!deal) {
            res.status(404).json({ message: 'Deal not found' });
            return;
        }

        if (deal.sellerId !== userId) {
            res.status(403).json({ message: 'Only assigned vendor can accept' });
            return;
        }

        if (deal.status === 'CANCELLED') {
            res.status(400).json({ message: 'Cannot accept cancelled deal ' });
            return;
        }

        const updated = await dealsDb.project.update({
            where: { id: dealId },
            data: { status: 'ACTIVE' }
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelDeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const dealId = String(req.params.id);

        const deal = await dealsDb.project.findUnique({ where: { id: dealId } });

        if (!deal) {
            res.status(404).json({ message: 'Deal not found' });
            return;
        }

        if (deal.buyerId !== userId && deal.sellerId !== userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        if (deal.status === 'CANCELLED') {
            res.status(400).json({ message: 'Deal already cancelled' });
            return;
        }

        const updated = await dealsDb.project.update({
            where: { id: dealId },
            data: { status: 'CANCELLED' }
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createMilestone = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const dealId = String(req.params.id);
        const { title, description, amount, sequence, currency, dueDate } = req.body;

        const deal = await dealsDb.project.findUnique({ where: { id: dealId } });
        if (!deal) {
            res.status(404).json({ message: 'Deal not found' });
            return;
        }

        if (deal.buyerId !== userId) {
            res.status(403).json({ message: 'Only buyer can create milestone' });
            return;
        }

        const milestone = await dealsDb.milestone.create({
            data: {
                projectId: dealId,
                title,
                description,
                amount: Number(amount),
                sequence: Number(sequence) || 1,
                currency: currency || 'USD',
                dueDate: dueDate ? new Date(dueDate) : null,
                status: 'PENDING'
            }
        });

        res.status(201).json(milestone);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
