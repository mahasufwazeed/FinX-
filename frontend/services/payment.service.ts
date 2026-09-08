import api from '@/lib/api';
import { Payment } from '@/types';

export interface VerifyPaymentPayload {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export const paymentService = {
    createPaymentOrder: async (projectId: string, milestoneId: string) => {
        const { data } = await api.post('/payments/orders', { projectId, milestoneId });
        return data;
    },

    verifyPayment: async (payload: VerifyPaymentPayload) => {
        const { data } = await api.post('/payments/verify', payload);
        return data;
    },

    getPaymentById: async (paymentId: string): Promise<Payment> => {
        const { data } = await api.get(`/payments/${paymentId}`);
        return data;
    },

    getProjectPayments: async (projectId: string): Promise<Payment[]> => {
        // Our mock backend aggregates all for the buyer right now, so we map it
        const { data } = await api.get('/payments');
        return data.filter((p: Payment) => p.projectId === projectId);
    },

    getBuyerPayments: async (): Promise<Payment[]> => {
        const { data } = await api.get('/payments');
        return data;
    },

    getPaymentStatus: async (paymentId: string): Promise<string> => {
        const payment = await paymentService.getPaymentById(paymentId);
        return payment.status;
    }
};
