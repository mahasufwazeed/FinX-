import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Milestone, Deliverable, EscrowTransaction } from '@/types';

interface EscrowStore {
    projects: Project[];
    milestones: Milestone[];
    deliverables: Deliverable[];
    escrows: EscrowTransaction[];

    createProject: (project: Omit<Project, 'id' | 'status'>) => void;
    depositEscrow: (milestoneId: string) => void;
    submitDeliverable: (deliverable: Omit<Deliverable, 'id' | 'status'>) => void;
    approveMilestone: (milestoneId: string) => void;
    releaseEscrow: (milestoneId: string) => void;
    rejectDeliverable: (deliverableId: string) => void;
}

export const useEscrowStore = create<EscrowStore>()(
    persist(
        (set) => ({
            projects: [
                { id: 'proj-1', title: 'Platform MVP Development', status: 'ACTIVE', amount: 15000 },
            ],
            milestones: [
                { id: 'mile-1', projectId: 'proj-1', description: 'Frontend Foundation', amount: 5000, status: 'FUNDED' },
                { id: 'mile-2', projectId: 'proj-1', description: 'Backend Architecture', amount: 10000, status: 'PENDING' },
            ],
            deliverables: [],
            escrows: [
                { id: 'esc-1', milestoneId: 'mile-1', amount: 5000, status: 'HELD' }
            ],

            createProject: (project) => set((state) => ({
                projects: [...state.projects, { ...project, id: `proj-${Date.now()}`, status: 'DRAFT' }]
            })),

            depositEscrow: (milestoneId) => set((state) => {
                const milestone = state.milestones.find(m => m.id === milestoneId);
                if (!milestone) return state;

                return {
                    milestones: state.milestones.map(m =>
                        m.id === milestoneId ? { ...m, status: 'FUNDED' } : m
                    ),
                    escrows: [...state.escrows, {
                        id: `esc-${Date.now()}`,
                        milestoneId,
                        amount: milestone.amount,
                        status: 'HELD'
                    }]
                };
            }),

            submitDeliverable: (deliverable) => set((state) => ({
                deliverables: [...state.deliverables, { ...deliverable, id: `del-${Date.now()}`, status: 'SUBMITTED' }],
                milestones: state.milestones.map(m =>
                    m.id === deliverable.milestoneId ? { ...m, status: 'REVIEW' } : m
                )
            })),

            approveMilestone: (milestoneId) => set((state) => ({
                milestones: state.milestones.map(m =>
                    m.id === milestoneId ? { ...m, status: 'APPROVED' } : m
                ),
                deliverables: state.deliverables.map(d =>
                    d.milestoneId === milestoneId ? { ...d, status: 'APPROVED' } : d
                )
            })),

            rejectDeliverable: (deliverableId) => set((state) => {
                const deliverable = state.deliverables.find(d => d.id === deliverableId);
                if (!deliverable) return state;

                return {
                    deliverables: state.deliverables.map(d =>
                        d.id === deliverableId ? { ...d, status: 'REJECTED' } : d
                    ),
                    milestones: state.milestones.map(m =>
                        m.id === deliverable.milestoneId ? { ...m, status: 'FUNDED' } : m
                    )
                };
            }),

            releaseEscrow: (milestoneId) => set((state) => ({
                milestones: state.milestones.map(m =>
                    m.id === milestoneId ? { ...m, status: 'RELEASED' } : m
                ),
                escrows: state.escrows.map(e =>
                    e.milestoneId === milestoneId ? { ...e, status: 'RELEASED' } : e
                )
            })),
        }),
        {
            name: 'finx-escrow-storage',
        }
    )
);
