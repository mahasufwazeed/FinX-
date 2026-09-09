import { Request, Response } from 'express';
import { prisma, createNotification } from '../db';
import crypto from 'crypto';

export const getAllMilestones = async (req: Request, res: Response): Promise<void> => {
    try {
        const milestones = await prisma.milestone.findMany({ include: { deliverables: true } });
        res.json(milestones);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch milestones' });
    }
}

export const getProjectMilestones = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId } = req.params;
        let milestones = await prisma.milestone.findMany({
            where: { projectId },
            include: { deliverables: true }
        });
        res.json(milestones);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching milestones' });
    }
};

export const getMilestone = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const milestone = await prisma.milestone.findUnique({
            where: { id },
            include: { deliverables: true }
        });

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
        const { id } = req.params;
        const milestone = await prisma.milestone.update({
            where: { id },
            data: { status: 'IN_PROGRESS' }
        });
        
        await createNotification(null, 'Changes Requested', 'The Project Manager requested revisions on your deliverable.', `/vendor/projects/${milestone.projectId}/milestones/${id}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};

const updateMilestoneStatus = async (id: string, newStatus: string) => {
    try {
        return await prisma.milestone.update({
            where: { id },
            data: { status: newStatus },
            include: { deliverables: true }
        });
    } catch(err) {
        return null;
    }
}

export const startMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = await updateMilestoneStatus(String(req.params.id), 'IN_PROGRESS');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const submitMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = await updateMilestoneStatus(String(req.params.id), 'UNDER_REVIEW');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const approveMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = await updateMilestoneStatus(String(req.params.id), 'APPROVED');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const rejectMilestone = async (req: Request, res: Response): Promise<void> => {
    const updated = await updateMilestoneStatus(String(req.params.id), 'REJECTED');
    if (!updated) res.status(404).json({ message: 'Not found' });
    else res.json(updated);
};

export const uploadDeliverable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const milestone = await prisma.milestone.findUnique({ where: { id } });

        if (!milestone) {
            res.status(404).json({ message: 'Milestone not found' });
            return;
        }

        const newDeliverable = await prisma.deliverable.create({
            data: {
                milestoneId: id,
                fileName: req.body?.fileName || 'document.zip',
                fileUrl: 'https://finx-vault.s3.aws.com/secure/' + crypto.randomUUID(),
                uploadedBy: 'Vendor',
            }
        });

        if (milestone.status === 'IN_PROGRESS') {
            await prisma.milestone.update({ where: { id }, data: { status: 'SUBMITTED' } });
        }

        res.status(201).json(newDeliverable);
    } catch (err) {
        res.status(500).json({ message: 'Upload failed' });
    }
};
