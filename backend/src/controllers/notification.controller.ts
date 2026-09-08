import { Request, Response } from 'express';
import { getDb, saveDb } from '../db';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDb();
        res.json(db.notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const db = getDb();
        const nIndex = db.notifications.findIndex((n: any) => n.id === id);
        if (nIndex > -1) {
            db.notifications[nIndex].isRead = true;
            saveDb(db);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDb();
        db.notifications = db.notifications.map((n: any) => ({ ...n, isRead: true }));
        saveDb(db);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};
