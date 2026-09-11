import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { releaseEscrow, getAdminEscrows, getDealEscrowBalance, getDealEscrowLedger } from '../controllers/escrow.controller';

const router = Router();
router.use(authenticate);

router.get('/', getAdminEscrows);
router.post('/:milestoneId/release', releaseEscrow);
router.get('/deal/:dealId', getDealEscrowBalance);
router.get('/ledger/deal/:dealId', getDealEscrowLedger);

export default router;
