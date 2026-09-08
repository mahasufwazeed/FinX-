import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getAdminDashboard, getUsers, getAuditLogs } from '../controllers/admin.controller';
import { getFinanceDashboard, getTransactions } from '../controllers/finance.controller';

const router = Router();
router.use(authenticate);

// Admin Routes
router.get('/admin/dashboard', getAdminDashboard);
router.get('/admin/users', getUsers);
router.get('/admin/audit-logs', getAuditLogs);

// Finance Routes
router.get('/finance/dashboard', getFinanceDashboard);
router.get('/finance/transactions', getTransactions);

export default router;
