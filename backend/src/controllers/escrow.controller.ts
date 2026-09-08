import { Request, Response } from 'express';
import { getDb, saveDb, createNotification } from '../db';
import crypto from 'crypto';

export const releaseEscrow = async (req: Request, res: Response): Promise<void> => {
    try {
        const { milestoneId } = req.params;
        const { comment } = req.body;
        const db = getDb();

        const milestoneIndex = db.milestones.findIndex((m: any) => m.id === milestoneId);
        if (milestoneIndex === -1) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        const milestone = db.milestones[milestoneIndex];

        if (milestone.status !== 'APPROVED' && milestone.status !== 'RELEASE_PENDING') {
            res.status(422).json({ message: 'Milestone must be approved before release authorization.' });
            return;
        }

        // Technically we might poll PROCESSING, but doing atomic success helps UI UX locally
        milestone.status = 'RELEASED';
        milestone.updatedAt = new Date().toISOString();
        db.milestones[milestoneIndex] = milestone;

        // Escrow ledger logic
        const tx = {
            id: 'escrow_tx_' + crypto.randomUUID().substring(0, 8),
            milestoneId,
            amount: milestone.amount,
            status: 'RELEASED',
            comment,
            releasedAt: new Date().toISOString()
        };
        db.escrows.push(tx);

        saveDb(db);

        // Notify
        createNotification(null, 'Escrow Released', `Funds for ${milestone.title} have been released to the vendor.`, '/vendor/escrow');

        res.json({ success: true, status: 'RELEASE_SUCCESS', transactionId: tx.id });
    } catch (err) {
        res.status(500).json({ message: 'Server error processing escrow release' });
    }
};

export const getAdminEscrows = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDb();
        const pending = db.milestones.filter((m: any) => m.status === 'APPROVED' || m.status === 'RELEASE_PENDING');
        const released = db.milestones.filter((m: any) => m.status === 'RELEASED');
        const disputed = db.milestones.filter((m: any) => m.status === 'DISPUTED');

        res.json({ pending, released, disputed });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
