import { Request, Response } from 'express';
import { getDb, saveDb, createNotification } from '../db';
import crypto from 'crypto';

// Get all milestones globally (for admin/finance/vendor aggregate UI)
export const getAllMilestones = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDb();
        res.json(db.milestones || []);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch milestones' });
    }
}

// Get all milestones for a project
export const getProjectMilestones = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId } = req.params;
        const db = getDb();

        let milestones = (db.milestones || []).filter((m: any) => m.projectId === projectId);

        // Auto-seed milestones if empty for demonstration
        if (milestones.length === 0 && projectId === 'proj-demo-1') {
            const seedMilestones = [
                {
                    id: 'mile-1',
                    projectId: 'proj-demo-1',
                    title: 'Phase 1: Foundation',
                    description: 'Set up NextJS templates and auth logic',
                    amount: 5000,
                    currency: 'USD',
                    status: 'PENDING',
                    deliverables: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'mile-2',
                    projectId: 'proj-demo-1',
                    title: 'Phase 2: Workflows',
                    description: 'Implement Escrow tracking hooks',
                    amount: 7500,
                    currency: 'USD',
                    status: 'PENDING',
                    deliverables: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            db.milestones = [...(db.milestones || []), ...seedMilestones];
            saveDb(db);
            milestones = seedMilestones;
        }

        res.json(milestones);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching milestones' });
    }
};

export const getMilestone = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const db = getDb();
        const milestone = (db.milestones || []).find((m: any) => m.id === id);

        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }
        res.json(milestone);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving milestone' });
    }
};

export const requestChanges = async (req: Request, res: Response): Promise<void> => {
    try {
        const { comment } = req.body;
        const db = getDb();
        const milestoneIndex = db.milestones.findIndex((m: any) => m.id === String(req.params.id));

        if (milestoneIndex > -1) {
            db.milestones[milestoneIndex].status = 'IN_PROGRESS'; // sends it back
            saveDb(db);
            createNotification(null, 'Changes Requested', 'The Project Manager requested revisions on your deliverable.', `/vendor/projects/${db.milestones[milestoneIndex].projectId}/milestones/${req.params.id}`);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};

const updateMilestoneStatus = (id: string, newStatus: string) => {
    const db = getDb();
    const milestones = db.milestones || [];
    const index = milestones.findIndex((m: any) => m.id === id);
    if (index === -1) return null;

    milestones[index].status = newStatus;
    milestones[index].updatedAt = new Date().toISOString();

    db.milestones = milestones;
    saveDb(db);
    return milestones[index];
}

export const startMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = updateMilestoneStatus(String(req.params.id), 'IN_PROGRESS');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const submitMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = updateMilestoneStatus(String(req.params.id), 'UNDER_REVIEW');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const approveMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = updateMilestoneStatus(String(req.params.id), 'APPROVED');
    // Note: Once approved, the admin triggers RELEASE_PENDING or RELEASED, but for now it's just APPROVED.
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const rejectMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = updateMilestoneStatus(String(req.params.id), 'REJECTED');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const uploadDeliverable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const db = getDb();
        const milestones = db.milestones || [];
        const index = milestones.findIndex((m: any) => m.id === id);

        if (index === -1) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        const newDeliverable = {
            id: crypto.randomUUID(),
            milestoneId: id,
            fileName: req.body?.fileName || 'document.zip',
            fileUrl: 'https://finx-vault.s3.aws.com/secure/' + crypto.randomUUID(),
            uploadedBy: 'Vendor',
            uploadedAt: new Date().toISOString()
        };

        milestones[index].deliverables = milestones[index].deliverables || [];
        milestones[index].deliverables.push(newDeliverable);
        // Also automatically transition to SUBMITTED if they upload something while IN_PROGRESS
        if (milestones[index].status === 'IN_PROGRESS') {
            milestones[index].status = 'SUBMITTED';
        }
        milestones[index].updatedAt = new Date().toISOString();

        db.milestones = milestones;
        saveDb(db);

        res.status(201).json(newDeliverable);
    } catch (err) {
        res.status(500).json({ message: 'Upload failed' });
    }
};
