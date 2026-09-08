import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { releaseEscrow, getAdminEscrows } from '../controllers/escrow.controller';

const router = Router();
router.use(authenticate);

router.get('/', getAdminEscrows);
router.post('/:milestoneId/release', releaseEscrow);

export default router;
