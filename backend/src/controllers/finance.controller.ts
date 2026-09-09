import { Request, Response } from 'express';
import { prisma } from '../db';

export const getFinanceDashboard = async (req: Request, res: Response) => {
    try {
        const payments = await prisma.payment.findMany({ where: { status: 'PAYMENT_SUCCESS' } });
        const deposits = payments.reduce((acc: number, p: any) => acc + p.amount, 0);

        const releasedMilestones = await prisma.milestone.findMany({ where: { status: 'RELEASED' } });
        const released = releasedMilestones.reduce((acc: number, m: any) => acc + m.amount, 0);

        res.json({
            totalDeposits: deposits,
            totalReleasedFunds: released,
            totalPendingFunds: deposits - released,
            totalRefunds: 0,
            totalPlatformFees: 0,
            totalFailedPayments: 0,
            totalFailedReleases: 0,
            currentSettlementStatus: 'OPERATIONAL'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const payments = await prisma.payment.findMany();
        const txs = payments.map((p: any) => ({
            id: p.id,
            type: 'DEPOSIT',
            projectId: p.projectId,
            milestoneId: p.milestoneId,
            grossAmount: p.amount,
            netAmount: p.amount,
            status: p.status,
            date: p.createdAt
        }));
        res.json(txs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
