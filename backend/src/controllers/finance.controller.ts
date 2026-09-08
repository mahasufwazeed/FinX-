import { Request, Response } from 'express';
import { getDb } from '../db';

export const getFinanceDashboard = async (req: Request, res: Response) => {
    const db = getDb();
    const deposits = db.payments?.filter((p: any) => p.status === 'PAYMENT_SUCCESS').reduce((acc: any, m: any) => acc + m.amount, 0) || 0;
    const released = db.milestones?.filter((p: any) => p.status === 'RELEASED').reduce((acc: any, m: any) => acc + m.amount, 0) || 0;
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
};

export const getTransactions = async (req: Request, res: Response) => {
    const db = getDb();
    const txs = db.payments?.map((p: any) => ({
        id: p.id,
        type: 'DEPOSIT',
        projectId: p.projectId,
        milestoneId: p.milestoneId,
        grossAmount: p.amount,
        netAmount: p.amount,
        status: p.status,
        date: p.createdAt
    })) || [];
    res.json(txs);
};
