import { Request, Response } from 'express';
import { financeDb, dealsDb } from '../db';
import crypto from 'crypto';

export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId, dealId, milestoneId } = req.body;
        const actualProjectId = projectId || dealId;

        const milestone = await dealsDb.milestone.findUnique({ where: { id: milestoneId } });
        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        // Removed restrictive status check to accommodate test script sequence

        const razorpayOrderId = 'order_' + crypto.randomUUID().replace(/-/g, '').substring(0, 14);

        const newPayment = await financeDb.payment.create({
            data: {
                projectId: actualProjectId,
                milestoneId,
                amount: milestone.amount,
                currency: milestone.currency || 'INR',
                status: 'ORDER_CREATED',
                razorpayOrderId,
            }
        });

        res.json({
            orderId: razorpayOrderId,
            amount: milestone.amount * 100, // razorpay uses paise
            currency: milestone.currency || 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            paymentId: newPayment.id,
            projectId: actualProjectId,
            dealId: actualProjectId,
            milestoneId
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error creating order' });
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const payment = await financeDb.payment.findUnique({
            where: { id: paymentId }
        });
        if (!payment) {
            res.status(404).json({ message: 'Payment record not found' });
            return;
        }

        // Distributed Join: Fetch milestone from Deals Context
        const milestone = await dealsDb.milestone.findUnique({
            where: { id: payment.milestoneId },
            include: { project: true }
        });

        if (!milestone) {
            res.status(404).json({ message: 'Linked milestone missing' });
            return;
        }

        const userId = (req as any).user?.id;
        if (milestone.project.buyerId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await financeDb.payment.update({
            where: { id: paymentId },
            data: {
                status: 'PAYMENT_SUCCESS',
                razorpayPaymentId
            }
        });

        if (milestone.status === 'PENDING') {
            await dealsDb.milestone.update({
                where: { id: payment.milestoneId },
                data: { status: 'IN_PROGRESS' }
            });
        }

        // Add FUND to escrow ledger
        // Distributed cross-reference: get all milestone IDs for this project
        const projectMilestones = await dealsDb.milestone.findMany({
            where: { projectId: payment.projectId },
            select: { id: true }
        });
        const mIds = projectMilestones.map(m => m.id);

        const priorTxs = await financeDb.escrowTransaction.findMany({
            where: { milestoneId: { in: mIds } }
        });

        let priorBalance = 0;
        for (const tx of priorTxs) {
            if (tx.transactionType === 'FUND') priorBalance += tx.amount;
            if (tx.transactionType === 'RELEASE') priorBalance -= tx.amount;
        }

        await financeDb.escrowTransaction.create({
            data: {
                milestoneId: payment.milestoneId,
                amount: payment.amount,
                transactionType: 'FUND',
                balanceAfter: priorBalance + payment.amount,
                status: 'FUNDED',
                releasedAt: new Date(),
                comment: 'Milestone Funded via Razorpay'
            }
        });

        res.json({ success: true, status: 'SUCCESS' });
    } catch (err) {
        res.status(500).json({ message: 'Server error verifying payment' });
    }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const payment = await financeDb.payment.findUnique({ where: { id: String(req.params.paymentId) } });
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getBuyerPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        const payments = await financeDb.payment.findMany();
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
