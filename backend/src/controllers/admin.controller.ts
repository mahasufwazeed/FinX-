import { Request, Response } from 'express';
import { prisma } from '../db';

export const getAdminDashboard = async (req: Request, res: Response) => {
    try {
        const usersCount = await prisma.user.count();
        const activeBuyers = await prisma.user.count({ where: { role: 'CORPORATE' } });
        const activeVendors = await prisma.user.count({ where: { role: 'VENDOR' } });
        const activeProjects = await prisma.project.count();

        const milestones = await prisma.milestone.findMany();
        const totalProjectValue = milestones.reduce((acc: number, m: any) => acc + m.amount, 0);

        const payments = await prisma.payment.findMany({ where: { status: 'PAYMENT_SUCCESS' } });
        const totalFundsDeposited = payments.reduce((acc: number, p: any) => acc + p.amount, 0);

        const totalFundsHeld = milestones.filter((m: any) => m.status === 'APPROVED' || m.status === 'RELEASE_PENDING').reduce((acc: number, m: any) => acc + m.amount, 0);
        const totalFundsReleased = milestones.filter((m: any) => m.status === 'RELEASED').reduce((acc: number, m: any) => acc + m.amount, 0);
        const pendingReleases = milestones.filter((m: any) => m.status === 'APPROVED' || m.status === 'RELEASE_PENDING').length;

        const openDisputes = await prisma.dispute.count({ where: { status: 'OPEN' } });
        const failedPayments = await prisma.payment.count({ where: { status: 'PAYMENT_FAILED' } });

        res.json({
            totalUsers: usersCount,
            activeBuyers,
            activeVendors,
            activeProjects,
            totalProjectValue,
            totalFundsDeposited,
            totalFundsHeld,
            totalFundsReleased,
            pendingReleases,
            openDisputes,
            failedPayments,
            failedReleases: 0
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
};

export const getAuditLogs = async (req: Request, res: Response) => {
    const logs = [
        { id: 'log_1', actorName: 'System', actorRole: 'SYSTEM', action: 'SYSTEM_START', entityType: 'SERVER', entityId: 'sys_0', description: 'FINX Secure Engine Init', timestamp: new Date().toISOString(), result: 'SUCCESS' }
    ];
    res.json(logs);
};
