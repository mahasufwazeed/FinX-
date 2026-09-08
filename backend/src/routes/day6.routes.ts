import { Router } from 'express';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';
import { getAdminDashboard, getUsers, getAuditLogs } from '../controllers/admin.controller';
import { getFinanceDashboard, getTransactions } from '../controllers/finance.controller';

const router = Router();
router.use(authenticate);

// Admin Routes
router.get('/admin/dashboard', authorizeRole(['ADMIN']), getAdminDashboard);
router.get('/admin/users', authorizeRole(['ADMIN']), getUsers);
router.get('/admin/audit-logs', authorizeRole(['ADMIN']), getAuditLogs);

// Finance Routes
router.get('/finance/dashboard', authorizeRole(['FINANCE', 'ADMIN']), getFinanceDashboard);
router.get('/finance/transactions', authorizeRole(['FINANCE', 'ADMIN']), getTransactions);

export default router;
