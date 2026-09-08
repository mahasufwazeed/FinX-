import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import milestoneRoutes from './routes/milestone.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', milestoneRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FINX Backend is running.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
