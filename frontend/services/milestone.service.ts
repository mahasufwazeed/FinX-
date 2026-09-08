import api from '@/lib/api';
import { Milestone, Deliverable } from '@/types';

export const milestoneService = {
    // Get all milestones for a project
    getProjectMilestones: async (projectId: string): Promise<Milestone[]> => {
        const { data } = await api.get(`/projects/${projectId}/milestones`);
        return data;
    },

    // Get a single milestone
    getMilestone: async (id: string): Promise<Milestone> => {
        const { data } = await api.get(`/milestones/${id}`);
        return data;
    },

    // Start a milestone (Vendor)
    startMilestone: async (id: string): Promise<Milestone> => {
        const { data } = await api.post(`/milestones/${id}/start`);
        return data;
    },

    // Submit deliverables (Vendor)
    uploadDeliverable: async (id: string, file: File): Promise<Deliverable> => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post(`/milestones/${id}/deliverables`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    // Submit milestone for review (Vendor)
    submitMilestone: async (id: string): Promise<Milestone> => {
        const { data } = await api.post(`/milestones/${id}/submit`);
        return data;
    },

    // Approve milestone (PM)
    approveMilestone: async (id: string): Promise<Milestone> => {
        const { data } = await api.post(`/milestones/${id}/approve`);
        return data;
    },

    // Reject milestone (PM)
    rejectMilestone: async (id: string, reason: string): Promise<Milestone> => {
        const { data } = await api.post(`/milestones/${id}/reject`, { reason });
        return data;
    },

    // Get endpoints across all projects (Dashboard aggregate endpoints mapped back to backend mock for simplicity)
    getAllMilestones: async (): Promise<Milestone[]> => {
        const { data } = await api.get('/milestones');
        return data;
    },
};
