import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createDispute, resolveDispute, getAllDisputes } from '../controllers/dispute.controller';

const router = Router();
router.use(authenticate);

router.get('/', getAllDisputes);
router.post('/', createDispute);
router.patch('/:id/resolve', resolveDispute);

export default router;
