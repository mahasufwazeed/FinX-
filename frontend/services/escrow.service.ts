import { api } from '@/lib/api';

export const escrowService = {
    releaseEscrow: async (milestoneId: string, comment: string) => {
        const { data } = await api.post(`/escrow/${milestoneId}/release`, { comment });
        return data;
    },
    getAdminEscrows: async () => {
        const { data } = await api.get('/escrow');
        return data;
    }
};
