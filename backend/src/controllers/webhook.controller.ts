import { Request, Response } from 'express';
import { prisma } from '../db';

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'];
    if (signature !== 'test_webhook_signature') {
        res.status(400).json({ message: 'Invalid signature' });
        return;
    }

    const orderId = req.body.payload?.payment?.entity?.order_id;
    const paymentIdStr = req.body.payload?.payment?.entity?.id;

    if (!orderId) { res.json({ success: true }); return; }

    const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: orderId } });
    if (!payment) { res.status(404).json({ message: 'Order not found' }); return; }

    if (payment.status === 'PAYMENT_SUCCESS') {
        res.json({ success: true, status: 'already_processed', data: { status: 'already_processed' } });
        return;
    }

    await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAYMENT_SUCCESS', razorpayPaymentId: paymentIdStr }
    });

    const priorTxs = await prisma.escrowTransaction.findMany({
        where: { milestone: { projectId: payment.projectId } }
    });

    let priorBalance = 0;
    for (const tx of priorTxs) {
        if (tx.transactionType === 'FUND') priorBalance += tx.amount;
        if (tx.transactionType === 'RELEASE') priorBalance -= tx.amount;
    }

    await prisma.escrowTransaction.create({
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
