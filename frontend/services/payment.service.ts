import { api } from '@/lib/api';
import { Payment } from '@/types';

export const PAYMENT_API_DISABLED_MSG = "Payment and Razorpay Escrow APIs are not yet implemented on the backend.";

export interface CreatePaymentOrderResponse {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    paymentId: string;
}

export interface VerifyPaymentPayload {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export const paymentService = {
    createPaymentOrder: async (projectId: string, milestoneId: string): Promise<CreatePaymentOrderResponse> => {
        return Promise.reject(new Error(PAYMENT_API_DISABLED_MSG));
    },

    verifyPayment: async (payload: VerifyPaymentPayload): Promise<any> => {
        return Promise.reject(new Error(PAYMENT_API_DISABLED_MSG));
    },

    getPaymentById: async (paymentId: string): Promise<Payment> => {
        return Promise.reject(new Error(PAYMENT_API_DISABLED_MSG));
    },

    getProjectPayments: async (projectId: string): Promise<Payment[]> => {
        return [];
    },

    getBuyerPayments: async (): Promise<Payment[]> => {
        return [];
    },

    getPaymentStatus: async (paymentId: string): Promise<string> => {
        return "NOT_CONFIGURED";
    }
};
