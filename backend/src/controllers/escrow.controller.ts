import { Request, Response } from 'express';
import { prisma, createNotification } from '../db';
import crypto from 'crypto';

export const releaseEscrow = async (req: Request, res: Response): Promise<void> => {
    try {
        const milestoneId = String(req.params.milestoneId);
        const { comment } = req.body;

        const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
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

        const tx = await prisma.escrowTransaction.create({
            data: {
                milestoneId,
                amount: milestone.amount,
                status: 'RELEASED',
                comment,
                releasedAt: new Date()
            }
        });

        await createNotification(null, 'Escrow Released', `Funds for ${milestone.title} have been released to the vendor.`, '/vendor/escrow');

        res.json({ success: true, status: 'RELEASE_SUCCESS', transactionId: tx.id });
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
