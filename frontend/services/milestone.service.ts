import { Milestone, Deliverable } from '@/types';

// The backend Milestone API is scheduled for future implementation and currently unavailable.
// We provide a clean service abstraction that strictly enforces this state.

export const MILESTONE_API_DISABLED_MSG = "Milestone APIs are not yet implemented on the backend.";

export const milestoneService = {
    getProjectMilestones: async (dealId: string): Promise<Milestone[]> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    getMilestone: async (id: string): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    getAllMilestones: async (): Promise<Milestone[]> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    createMilestone: async (dealId: string, payload: any): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    startMilestone: async (id: string): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    uploadDeliverable: async (id: string, file: File): Promise<Deliverable> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    submitMilestone: async (id: string): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    approveMilestone: async (id: string): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    rejectMilestone: async (id: string, reason: string): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    },

    requestChanges: async (id: string, comment: string): Promise<Milestone> => {
        return Promise.reject(new Error(MILESTONE_API_DISABLED_MSG));
    }
};
