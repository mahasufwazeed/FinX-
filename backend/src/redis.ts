import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const connectRedis = async () => {
    try {
        // The REST API doesn't need to strictly 'connect', but we can ping to verify credentials
        await redisClient.ping();
        console.log('🔗 Successfully verified Upstash Redis (REST API connection)');
    } catch (error) {
        console.error('❌ Failed to verify Upstash Redis REST connection:', error);
    }
};
