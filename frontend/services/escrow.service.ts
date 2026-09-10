import { api } from "@/lib/api";
import { EscrowAccount, EscrowLedger, ApiResponse } from "@/types";

export const escrowService = {
    getDealEscrow: async (dealId: string): Promise<EscrowAccount> => {
        const response = await api.get<ApiResponse<EscrowAccount> | EscrowAccount>(`/escrow/deal/${dealId}`);
        const data = (response.data as ApiResponse<EscrowAccount>)?.data || (response.data as EscrowAccount);
        return data;
    },

    getDealEscrowLedger: async (dealId: string): Promise<EscrowLedger[]> => {
        const response = await api.get<ApiResponse<EscrowLedger[]> | EscrowLedger[]>(`/escrow/ledger/deal/${dealId}`);
        const data = (response.data as ApiResponse<EscrowLedger[]>)?.data || (response.data as EscrowLedger[]);
        return data || [];
    },

    releaseEscrow: async (milestoneId: string, comment?: string): Promise<EscrowLedger> => {
        const response = await api.post<ApiResponse<EscrowLedger> | EscrowLedger>(
            `/escrow/${milestoneId}/release`,
            { comment }
        );
        const data = (response.data as ApiResponse<EscrowLedger>)?.data || (response.data as EscrowLedger);
        return data;
    },

    getAllEscrows: async (): Promise<EscrowAccount[]> => {
        const response = await api.get<ApiResponse<EscrowAccount[]> | EscrowAccount[]>("/escrow");
        const data = (response.data as ApiResponse<EscrowAccount[]>)?.data || (response.data as EscrowAccount[]);
        return data || [];
    },

    getAdminEscrows: async (): Promise<EscrowAccount[]> => {
        return escrowService.getAllEscrows();
    }
};

