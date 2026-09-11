import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
    getDeals,
    getDeal,
    createDeal,
    getSellers,
    acceptDeal,
    cancelDeal,
    createMilestone
} from '../controllers/deal.controller';

const router = Router();
router.use(authenticate);

router.get('/sellers', getSellers);
router.get('/', getDeals);
router.post('/', createDeal);
router.get('/:id', getDeal);
router.patch('/:id/accept', acceptDeal);
router.patch('/:id/cancel', cancelDeal);
router.post('/:id/milestones', createMilestone);

export default router;
