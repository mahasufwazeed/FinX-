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
        const projectId = String(req.params.projectId);
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
        const id = String(req.params.id);
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
        const id = String(req.params.id);
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
    } catch (err) {
        return null;
    }
}

const getProjectContext = async (milestoneId: string) => {
    const milestone = await prisma.milestone.findUnique({
        where: { id: milestoneId },
        include: { project: true }
    });
    return milestone;
};

export const startMilestone = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const ctx = await getProjectContext(String(req.params.id));
    if (!ctx) { res.status(404).json({ message: 'Not found' }); return; }
    if (ctx.project.sellerId !== userId && ctx.project.buyerId !== userId) {
        res.status(401).json({ message: 'Unauthorized' }); return;
    }
    const updated = await updateMilestoneStatus(ctx.id, 'IN_PROGRESS');
    res.json(updated);
};

export const submitMilestone = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const ctx = await getProjectContext(String(req.params.id));
    if (!ctx) { res.status(404).json({ message: 'Not found' }); return; }
    if (ctx.project.sellerId !== userId) {
        res.status(401).json({ message: 'Only vendor can submit' }); return;
    }

    const { fileName, fileUrl, description } = req.body;
    if (!fileName || !fileUrl) {
        if (!fileName) return res.status(400).json({ message: 'fileName is required' }) as any;
        return res.status(400).json({ message: 'fileUrl is required' }) as any;
    }

    if (description && description.length > 4000) {
        return res.status(400).json({ message: 'Description exceeds 4000 limit' }) as any;
    }

    const deliverable = await prisma.deliverable.create({
        data: {
            milestoneId: ctx.id,
            fileName,
            fileUrl,
            uploadedBy: userId,
            description,
            status: 'PENDING'
        }
    });

    await updateMilestoneStatus(ctx.id, 'UNDER_REVIEW');
    res.status(201).json(deliverable);
};

export const approveMilestone = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const ctx = await getProjectContext(String(req.params.id));
    if (!ctx) { res.status(404).json({ message: 'Not found' }); return; }
    if (ctx.project.buyerId !== userId && (req as any).user?.role !== 'ADMIN') {
        res.status(401).json({ message: 'Only buyer can approve' }); return;
    }
    const updated = await updateMilestoneStatus(ctx.id, 'APPROVED');
    res.json(updated);
};

export const rejectMilestone = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const ctx = await getProjectContext(String(req.params.id));
    if (!ctx) { res.status(404).json({ message: 'Not found' }); return; }
    if (ctx.project.buyerId !== userId && (req as any).user?.role !== 'ADMIN') {
        res.status(401).json({ message: 'Only buyer can reject' }); return;
    }
    const updated = await updateMilestoneStatus(ctx.id, 'REJECTED');
    res.json(updated);
};

export const uploadDeliverable = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
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
