"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, ShieldCheck, Clock } from "lucide-react";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";

export default function VendorEscrowDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mimics reading all global assigned milestones for this vendor via the new proxy logic
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, []);

    const totalEarned = milestones.filter(m => m.status === 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const amountHeld = milestones.filter(m => m.status !== 'RELEASED' && m.status !== 'PENDING').reduce((sum, m) => sum + m.amount, 0);
    const awaitingRelease = milestones.filter(m => m.status === 'APPROVED' || m.status === 'RELEASE_PENDING').reduce((sum, m) => sum + m.amount, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Income & Escrow</h1>
                    <p className="text-sm text-slate-500 mt-1">Track funds securely held in escrow, pending approval, and released.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Released (Total Earned)</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">${totalEarned.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">In Progress (Held in Escrow)</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${amountHeld.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <Briefcase size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Awaiting Auto-Release</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-2">${awaitingRelease.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestone Vault Ledgers</h2>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Milestone</th>
                                    <th className="p-4 font-semibold text-slate-600">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Current Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Expected Release</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading ledger...</td></tr>}
                                {!isLoading && milestones.map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">{m.title}</td>
                                        <td className="p-4 font-semibold text-slate-700">${m.amount.toLocaleString()} {m.currency}</td>
                                        <td className="p-4"><MilestoneStatusBadge status={m.status} /></td>
                                        <td className="p-4 text-slate-500">
                                            {m.status === 'RELEASED' ? (
                                                <span className="text-emerald-600 font-medium">Released to Bank</span>
                                            ) : m.status === 'APPROVED' ? (
                                                <span className="text-amber-600 font-medium">Pending Admin Sweep</span>
                                            ) : (
                                                "Pending Approvals"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
