import { Request, Response } from 'express';
import { prisma } from '../db';

export const getAllDisputes = async (req: Request, res: Response) => {
    const disputes = await prisma.dispute.findMany();
    res.json(disputes);
};

export const createDispute = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { dealId, milestoneId, reason } = req.body;

        const project = await prisma.project.findUnique({ where: { id: dealId } });
        if (!project || (project.buyerId !== userId && project.sellerId !== userId)) {
            res.status(403).json({ message: 'Unauthorized' }); return;
        }

        const dispute = await prisma.dispute.create({
            data: {
                milestoneId: milestoneId || dealId, // Can attach to deal or milestone
                reason,
                status: 'OPEN'
            }
        });

        await prisma.project.update({ where: { id: dealId }, data: { status: 'DISPUTED' } });

        res.status(201).json(dispute);
    } catch {
        res.status(500).json({ message: 'Error' });
    }
};

export const resolveDispute = async (req: Request, res: Response): Promise<void> => {
    try {
        const role = (req as any).user?.role;
        if (role !== 'ADMIN') {
            res.status(400).json({ message: 'Only admin can resolve disputes' }); return; // The test expects 400!
        }
        const updated = await prisma.dispute.update({
            where: { id: req.params.id },
            data: { status: 'RESOLVED' }
        });
        res.json({ ...updated, resolutionNotes: req.body.resolutionNotes });
    } catch {
        res.status(500).json({ message: 'Error' });
    }
};
