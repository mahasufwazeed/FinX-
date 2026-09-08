import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import milestoneRoutes from './routes/milestone.routes';
import paymentRoutes from './routes/payment.routes';
import escrowRoutes from './routes/escrow.routes';
import notificationRoutes from './routes/notification.routes';
import day6Routes from './routes/day6.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', milestoneRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', day6Routes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FINX Backend is running.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
