import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Deal, Milestone, EscrowTransaction, AuditLog, User } from "@/types";

interface EscrowState {
    deals: Deal[];
    milestones: Milestone[];
    transactions: EscrowTransaction[];
    auditLogs: AuditLog[];

    // Actions
    addDeal: (deal: Deal, userId: string) => void;
    addMilestone: (milestone: Milestone, userId: string) => void;
    fundMilestone: (milestoneId: string, userId: string) => void;
    submitWork: (milestoneId: string, userId: string) => void;
    approveWork: (milestoneId: string, userId: string) => void;
    disputeWork: (milestoneId: string, userId: string) => void;
}

export const useEscrowStore = create<EscrowState>()(
    persist(
        (set) => ({
            deals: [],
            milestones: [],
            transactions: [],
            auditLogs: [],

            addDeal: (deal, userId) => set((state) => {
                const log: AuditLog = {
                    id: Date.now().toString(),
                    action: `Created Deal: ${deal.title}`,
                    timestamp: new Date().toISOString(),
                    userId,
                };
                return {
                    deals: [...state.deals, deal],
                    auditLogs: [log, ...state.auditLogs],
                };
            }),

            addMilestone: (milestone, userId) => set((state) => {
                const log: AuditLog = {
                    id: Date.now().toString(),
                    action: `Added Milestone to Deal ${milestone.dealId}`,
                    timestamp: new Date().toISOString(),
                    userId,
                };
                return {
                    milestones: [...state.milestones, milestone],
                    auditLogs: [log, ...state.auditLogs],
                };
            }),

            fundMilestone: (milestoneId, userId) => set((state) => {
                const milestone = state.milestones.find((m) => m.id === milestoneId);
                if (!milestone) return state;

                const transaction: EscrowTransaction = {
                    id: `tx_${Date.now()}`,
                    milestoneId,
                    amount: milestone.amount,
                    status: 'HELD'
                };

                const log: AuditLog = {
                    id: Date.now().toString(),
                    action: `Funded Milestone: $${milestone.amount} into Escrow`,
                    timestamp: new Date().toISOString(),
                    userId,
                };

                return {
                    milestones: state.milestones.map((m) =>
                        m.id === milestoneId ? { ...m, status: 'FUNDED' } : m
                    ),
                    transactions: [...state.transactions, transaction],
                    auditLogs: [log, ...state.auditLogs],
                };
            }),

            submitWork: (milestoneId, userId) => set((state) => {
                const log: AuditLog = {
                    id: Date.now().toString(),
                    action: `Submitted work for Milestone ${milestoneId} review`,
                    timestamp: new Date().toISOString(),
                    userId,
                };
                return {
                    milestones: state.milestones.map((m) =>
                        m.id === milestoneId ? { ...m, status: 'REVIEW' } : m
                    ),
                    auditLogs: [log, ...state.auditLogs],
                };
            }),

            approveWork: (milestoneId, userId) => set((state) => {
                const log: AuditLog = {
                    id: Date.now().toString(),
                    action: `Approved Milestone ${milestoneId} - Releasing Escrow`,
                    timestamp: new Date().toISOString(),
                    userId,
                };

                return {
                    milestones: state.milestones.map((m) =>
                        m.id === milestoneId ? { ...m, status: 'RELEASED' } : m
                    ),
                    transactions: state.transactions.map((tx) =>
                        tx.milestoneId === milestoneId ? { ...tx, status: 'RELEASED' } : tx
                    ),
                    auditLogs: [log, ...state.auditLogs],
                };
            }),

            disputeWork: (milestoneId, userId) => set((state) => {
                const log: AuditLog = {
                    id: Date.now().toString(),
                    action: `Raised Dispute on Milestone ${milestoneId}`,
                    timestamp: new Date().toISOString(),
                    userId,
                };
                return {
                    milestones: state.milestones.map((m) =>
                        m.id === milestoneId ? { ...m, status: 'DISPUTED' } : m
                    ),
                    auditLogs: [log, ...state.auditLogs],
                };
            }),
        }),
        {
            name: "finx-escrow-storage",
        }
    )
);
