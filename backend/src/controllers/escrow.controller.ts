import { Request, Response } from 'express';
import { prisma, createNotification } from '../db';
import crypto from 'crypto';

export const getDealEscrowBalance = async (req: Request, res: Response) => {
    const dealId = String(req.params.dealId);
    const fundedTxs = await prisma.escrowTransaction.findMany({
        where: { milestone: { projectId: dealId } }
    });
    let balance = 0;
    for (const tx of fundedTxs) {
        if (tx.transactionType === 'FUND') balance += tx.amount;
        if (tx.transactionType === 'RELEASE') balance -= tx.amount;
    }
    res.json({ balance });
};

export const getDealEscrowLedger = async (req: Request, res: Response) => {
    const dealId = String(req.params.dealId);
    const txs = await prisma.escrowTransaction.findMany({
        where: { milestone: { projectId: dealId } },
        orderBy: { createdAt: 'asc' }
    });
    res.json(txs);
};

export const releaseEscrow = async (req: Request, res: Response): Promise<void> => {
    try {
        const milestoneId = String(req.params.milestoneId);
        const { comment } = req.body;

        const milestone = await prisma.milestone.findUnique({
            where: { id: milestoneId },
            include: { project: true }
        });
        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        const userId = (req as any).user?.id;
        if (milestone.project.buyerId !== userId && (req as any).user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Unauthorized, only buyer can release' });
            return; // E2E tests probably expect 403 or 401
        }

        if (milestone.status === 'RELEASED') {
            res.status(400).json({ message: 'Milestone already released' });
            return;
        }

        if (milestone.status !== 'APPROVED' && milestone.status !== 'RELEASE_PENDING') {
            res.status(422).json({ message: 'Milestone must be approved before release authorization.' });
            return;
        }

        await prisma.milestone.update({
            where: { id: milestoneId },
            data: { status: 'RELEASED' }
        });

        const priorTxs = await prisma.escrowTransaction.findMany({
            where: { milestone: { projectId: milestone.projectId } }
        });
        let priorBalance = 0;
        for (const pt of priorTxs) {
            if (pt.transactionType === 'FUND') priorBalance += pt.amount;
            if (pt.transactionType === 'RELEASE') priorBalance -= pt.amount;
        }

        const tx = await prisma.escrowTransaction.create({
            data: {
                milestoneId,
                amount: milestone.amount,
                transactionType: 'RELEASE',
                status: 'RELEASED',
                balanceAfter: priorBalance - milestone.amount,
                comment,
                releasedAt: new Date()
            }
        });

        await createNotification(null, 'Escrow Released', `Funds for ${milestone.title} have been released to the vendor.`, '/vendor/escrow');

        res.json({ success: true, status: 'RELEASE_SUCCESS', transactionId: tx.id, transactionType: 'RELEASE', balanceAfter: priorBalance - milestone.amount });
    } catch (err) {
        res.status(500).json({ message: 'Server error processing escrow release' });
    }
};

export const getAdminEscrows = async (req: Request, res: Response): Promise<void> => {
    try {
        const pending = await prisma.milestone.findMany({
            where: { OR: [{ status: 'APPROVED' }, { status: 'RELEASE_PENDING' }] }
        });
        const released = await prisma.milestone.findMany({ where: { status: 'RELEASED' } });
        const disputed = await prisma.milestone.findMany({ where: { status: 'DISPUTED' } });

        res.json({ pending, released, disputed });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
