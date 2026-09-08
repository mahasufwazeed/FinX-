import { api } from '@/lib/api';

export const adminService = {
    getDashboard: async () => {
        const { data } = await api.get('/admin/dashboard');
        return data;
    },
    getUsers: async () => {
        const { data } = await api.get('/admin/users');
        return data;
    },
    getAuditLogs: async () => {
        const { data } = await api.get('/admin/audit-logs');
        return data;
    }
};

export const financeService = {
    getDashboard: async () => {
        const { data } = await api.get('/finance/dashboard');
        return data;
    },
    getTransactions: async () => {
        const { data } = await api.get('/finance/transactions');
        return data;
    }
};
