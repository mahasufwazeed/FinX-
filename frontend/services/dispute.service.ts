import { api } from "@/lib/api";
import { Dispute, ApiResponse } from "@/types";

export interface CreateDisputePayload {
    dealId: string;
    milestoneId?: string;
    reason: string;
}

export const disputeService = {
    createDispute: async (payload: CreateDisputePayload): Promise<Dispute> => {
        const response = await api.post<ApiResponse<Dispute> | Dispute>("/disputes", payload);
        const data = (response.data as ApiResponse<Dispute>)?.data || (response.data as Dispute);
        return data;
    },

    getAllDisputes: async (): Promise<Dispute[]> => {
        const response = await api.get<ApiResponse<Dispute[]> | Dispute[]>("/disputes");
        const data = (response.data as ApiResponse<Dispute[]>)?.data || (response.data as Dispute[]);
        return data || [];
    },

    getDisputesForDeal: async (dealId: string): Promise<Dispute[]> => {
        const response = await api.get<ApiResponse<Dispute[]> | Dispute[]>(`/disputes/deal/${dealId}`);
        const data = (response.data as ApiResponse<Dispute[]>)?.data || (response.data as Dispute[]);
        return data || [];
    },

    resolveDispute: async (disputeId: string, resolutionNotes: string): Promise<Dispute> => {
        const response = await api.patch<ApiResponse<Dispute> | Dispute>(`/disputes/${disputeId}/resolve`, {
            resolutionNotes
        });
        const data = (response.data as ApiResponse<Dispute>)?.data || (response.data as Dispute);
        return data;
    }
};
