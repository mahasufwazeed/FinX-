import { api } from '@/lib/api';

export interface Notification {
    id: string;
    title: string;
    message: string;
    route: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const { data } = await api.get('/notifications');
        return data;
    },
    markAsRead: async (id: string) => {
        await api.patch(`/notifications/${id}/read`);
    },
    markAllAsRead: async () => {
        await api.patch('/notifications/read-all');
    }
};
