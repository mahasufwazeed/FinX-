import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import milestoneRoutes from './routes/milestone.routes';
import paymentRoutes from './routes/payment.routes';
import escrowRoutes from './routes/escrow.routes';
import notificationRoutes from './routes/notification.routes';
import day6Routes from './routes/day6.routes';
import dealRoutes from './routes/deal.routes';
import disputeRoutes from './routes/dispute.routes';
import webhookRoutes from './routes/webhook.routes';
import { connectRedis } from './redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

import { redisClient } from './redis';

// Health check mapped before auth middleware to remain public
app.get('/api/health', async (req, res) => {
    try {
        await redisClient.ping();
        res.json({
            status: 'ok',
            message: 'FINX Backend is running.',
            redis: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'degraded',
            message: 'FINX Backend is running, but Redis is disconnected.',
            redis: 'disconnected'
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
import { handleRazorpayWebhook } from './controllers/webhook.controller';
app.post('/api/payments/webhook', handleRazorpayWebhook);

app.use('/api', milestoneRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', day6Routes);
app.use('/api/deals', dealRoutes);
app.use('/api/disputes', disputeRoutes);



app.listen(PORT, async () => {
    await connectRedis();
    console.log(`🚀 Server running on port ${PORT}`);
});
