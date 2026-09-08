import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
    createPaymentOrder,
    verifyPayment,
    getPaymentById,
    getBuyerPayments
} from '../controllers/payment.controller';

const router = Router();

router.use(authenticate);

router.post('/orders', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/', getBuyerPayments);
router.get('/:paymentId', getPaymentById);

export default router;
