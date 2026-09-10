import { api } from "@/lib/api";
import { Payment, ApiResponse } from "@/types";

export interface CreatePaymentOrderResponse {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    paymentId: string;
    dealTitle?: string;
    milestoneTitle?: string;
}

export interface VerifyPaymentPayload {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export const paymentService = {
    createPaymentOrder: async (dealId: string, milestoneId: string, idempotencyKey?: string): Promise<CreatePaymentOrderResponse> => {
        const response = await api.post<ApiResponse<CreatePaymentOrderResponse> | CreatePaymentOrderResponse>(
            "/payments/create-order",
            { dealId, milestoneId, idempotencyKey }
        );
        const data = (response.data as ApiResponse<CreatePaymentOrderResponse>)?.data || (response.data as CreatePaymentOrderResponse);
        return data;
    },

    verifyPayment: async (payload: VerifyPaymentPayload): Promise<Payment> => {
        const response = await api.post<ApiResponse<Payment> | Payment>(
            "/payments/verify",
            payload
        );
        const data = (response.data as ApiResponse<Payment>)?.data || (response.data as Payment);
        return data;
    },

    getPaymentById: async (paymentId: string): Promise<Payment> => {
        const response = await api.get<ApiResponse<Payment> | Payment>(`/payments/${paymentId}`);
        const data = (response.data as ApiResponse<Payment>)?.data || (response.data as Payment);
        return data;
    },

    getProjectPayments: async (dealId: string): Promise<Payment[]> => {
        const response = await api.get<ApiResponse<Payment[]> | Payment[]>(`/payments/deal/${dealId}`);
        const data = (response.data as ApiResponse<Payment[]>)?.data || (response.data as Payment[]);
        return data || [];
    },

    getBuyerPayments: async (): Promise<Payment[]> => {
        const response = await api.get<ApiResponse<Payment[]> | Payment[]>("/payments/buyer");
        const data = (response.data as ApiResponse<Payment[]>)?.data || (response.data as Payment[]);
        return data || [];
    }
};

export const PAYMENT_API_DISABLED_MSG = "";
