import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Global robust notification generator for live DB
export async function createNotification(userId: string | null, title: string, message: string, route: string) {
    try {
        await prisma.notification.create({
            data: {
                userId, // if null, global/admin broadcast
                title,
                message,
                route,
                isRead: false
            }
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}
