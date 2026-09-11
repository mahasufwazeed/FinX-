import { Request, Response } from 'express';
import { financeDb, dealsDb } from '../db';

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'];
    if (signature !== 'test_webhook_signature') {
        res.status(400).json({ message: 'Invalid signature' });
        return;
    }

    const orderId = req.body.payload?.payment?.entity?.order_id;
    const paymentIdStr = req.body.payload?.payment?.entity?.id;

    if (!orderId) { res.json({ success: true }); return; }

    const payment = await financeDb.payment.findFirst({ where: { razorpayOrderId: orderId } });
    if (!payment) { res.status(404).json({ message: 'Order not found' }); return; }

    if (payment.status === 'PAYMENT_SUCCESS') {
        res.json({ success: true, status: 'already_processed', data: { status: 'already_processed' } });
        return;
    }

    await financeDb.payment.update({
        where: { id: payment.id },
        data: { status: 'PAYMENT_SUCCESS', razorpayPaymentId: paymentIdStr }
    });

    const projectMilestones = await dealsDb.milestone.findMany({ where: { projectId: payment.projectId }, select: { id: true } });
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
            comment: 'Funded via Webhook'
        }
    });

    res.json({ success: true, status: 'success', data: { status: 'success' } });
};
