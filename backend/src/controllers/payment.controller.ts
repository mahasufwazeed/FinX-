import { Request, Response } from 'express';
import { getDb, saveDb } from '../db';
import crypto from 'crypto';

export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId, milestoneId } = req.body;
        const db = getDb();

        const milestone = db.milestones?.find((m: any) => m.id === milestoneId);
        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        if (milestone.status !== 'PENDING') {
            res.status(422).json({ message: 'Milestone is no longer pending funding.' });
            return;
        }

        const paymentId = 'pay_' + crypto.randomUUID().replace(/-/g, '').substring(0, 14);
        const razorpayOrderId = 'order_' + crypto.randomUUID().replace(/-/g, '').substring(0, 14);

        const newPayment = {
            id: paymentId,
            projectId,
            milestoneId,
            amount: milestone.amount,
            currency: milestone.currency || 'INR',
            status: 'ORDER_CREATED',
            razorpayOrderId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.payments.push(newPayment);
        saveDb(db);

        res.json({
            orderId: razorpayOrderId,
            amount: milestone.amount * 100, // razorpay uses paise
            currency: milestone.currency || 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            paymentId,
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
        const db = getDb();

        const paymentIndex = db.payments.findIndex((p: any) => p.id === paymentId);
        if (paymentIndex === -1) {
            res.status(404).json({ message: 'Payment record not found' });
            return;
        }

        // Normally we would verify cryptographic signature here. For this implementation we mock verify.

        db.payments[paymentIndex].status = 'PAYMENT_SUCCESS';
        db.payments[paymentIndex].razorpayPaymentId = razorpayPaymentId;
        db.payments[paymentIndex].updatedAt = new Date().toISOString();

        // Also update milestone status to FUNDED/IN_PROGRESS
        const milestoneId = db.payments[paymentIndex].milestoneId;
        const milestoneIndex = db.milestones?.findIndex((m: any) => m.id === milestoneId);
        if (milestoneIndex !== -1) {
            db.milestones[milestoneIndex].status = 'IN_PROGRESS';
            db.milestones[milestoneIndex].updatedAt = new Date().toISOString();
        }

        saveDb(db);

        res.json({ success: true, status: 'PAYMENT_SUCCESS' });
    } catch (err) {
        res.status(500).json({ message: 'Server error verifying payment' });
    }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDb();
        const payment = db.payments.find((p: any) => p.id === req.params.paymentId);
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
        const db = getDb();
        res.json(db.payments || []);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
