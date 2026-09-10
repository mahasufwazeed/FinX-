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
        try {
            const { data } = await api.get('/notifications');
            return data || [];
        } catch {
            // Notifications API not enabled on backend yet
            return [];
        }
    },
    markAsRead: async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
        } catch {
            // No-op until backend notification service is enabled
        }
    },
    markAllAsRead: async () => {
        try {
            await api.patch('/notifications/read-all');
        } catch {
            // No-op until backend notification service is enabled
        }
    }
};
