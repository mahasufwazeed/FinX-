import { PrismaClient as LegacyPrismaClient } from '@prisma/client';
import { PrismaClient as AuthClient } from '@prisma/auth-client';
import { PrismaClient as DealsClient } from '@prisma/deals-client';
import { PrismaClient as FinanceClient } from '@prisma/finance-client';
import { PrismaClient as SupportClient } from '@prisma/support-client';
import { PrismaClient as TelemetryClient } from '@prisma/telemetry-client';

// Legacy monolithic connection (TO BE DEPRECATED)
export const prisma = new LegacyPrismaClient();

// The 5 Independent Microservice Boundaries
export const authDb = new AuthClient();
export const dealsDb = new DealsClient();
export const financeDb = new FinanceClient();
export const supportDb = new SupportClient();
export const telemetryDb = new TelemetryClient();

// Global Notification dispatcher dynamically routed to the Telemetry Service Context
export async function createNotification(userId: string | null, title: string, message: string, route: string) {
    try {
        await telemetryDb.notification.create({
            data: {
                userId, // references user ID abstractly
                title,
                message,
                route,
                isRead: false
            }
        });
    } catch (error) {
        console.error("Failed to create notification via Telemetry DB:", error);
    }
}
