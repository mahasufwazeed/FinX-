import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller';

const router = Router();
router.use(authenticate);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
