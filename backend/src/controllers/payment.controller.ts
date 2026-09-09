import { Request, Response } from 'express';
import { prisma } from '../db';
import crypto from 'crypto';

export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId, milestoneId } = req.body;
        
        const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        if (milestone.status !== 'PENDING') {
            res.status(422).json({ message: 'Milestone is no longer pending funding.' });
            return;
        }

        const razorpayOrderId = 'order_' + crypto.randomUUID().replace(/-/g, '').substring(0, 14);

        const newPayment = await prisma.payment.create({
            data: {
                projectId,
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
            projectId,
            milestoneId
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error creating order' });
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment) {
            res.status(404).json({ message: 'Payment record not found' });
            return;
        }

        await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'PAYMENT_SUCCESS',
                razorpayPaymentId
            }
        });

        await prisma.milestone.update({
            where: { id: payment.milestoneId },
            data: { status: 'IN_PROGRESS' }
        });

        res.json({ success: true, status: 'PAYMENT_SUCCESS' });
    } catch (err) {
        res.status(500).json({ message: 'Server error verifying payment' });
    }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const payment = await prisma.payment.findUnique({ where: { id: String(req.params.paymentId) } });
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
        const payments = await prisma.payment.findMany();
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
