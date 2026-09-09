import { Request, Response } from 'express';
import { prisma } from '../db';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const notifications = await prisma.notification.findMany({
            where: { OR: [{ userId }, { userId: null }] },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};
