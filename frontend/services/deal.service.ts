import { api } from "@/lib/api";
import { Deal, DealResponse } from "@/types";

export interface CreateDealRequest {
    title: string;
    description: string;
    sellerId: string;
    totalAmount: number;
    currency: string;
}

export const dealService = {
    getDeals: async (): Promise<Deal[]> => {
        const response = await api.get<{ success: boolean; message: string; data: Deal[] }>("/deals");
        return response.data.data;
    },

    getDealById: async (id: string): Promise<Deal> => {
        const response = await api.get<{ success: boolean; message: string; data: Deal }>(`/deals/${id}`);
        return response.data.data;
    },

    createDeal: async (request: CreateDealRequest): Promise<Deal> => {
        const response = await api.post<{ success: boolean; message: string; data: Deal }>("/deals", request);
        return response.data.data;
    }
};
