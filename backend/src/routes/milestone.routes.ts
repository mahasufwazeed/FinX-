import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
    getProjectMilestones,
    getMilestone,
    startMilestone,
    uploadDeliverable,
    submitMilestone,
    approveMilestone,
    rejectMilestone, requestChanges,
    getAllMilestones
} from '../controllers/milestone.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

router.get('/projects/:projectId/milestones', getProjectMilestones);
router.get('/milestones', getAllMilestones); // dashboard aggregator
router.get('/milestones/:id', getMilestone);
router.post('/milestones/:id/start', startMilestone);
router.post('/milestones/:id/submit', submitMilestone);
router.post('/milestones/:id/approve', approveMilestone);
router.post('/milestones/:id/reject', rejectMilestone);
router.post('/milestones/:id/request-changes', requestChanges);
router.post('/milestones/:id/deliverables', uploadDeliverable); // uses generic json payload

export default router;
