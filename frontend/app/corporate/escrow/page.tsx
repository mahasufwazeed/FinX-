"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { ShieldCheck, Activity, ShieldAlert, ArrowRight } from "lucide-react";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function BuyerEscrowDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const projectId = 'proj-demo-1';

    useEffect(() => {
        milestoneService.getProjectMilestones(projectId)
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, [projectId]);

    const totalFundedAmount = milestones.filter(m => m.status !== 'PENDING').reduce((sum, m) => sum + m.amount, 0);
    const totalReleased = milestones.filter(m => m.status === 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const pendingApproval = milestones.filter(m => m.status === 'SUBMITTED' || m.status === 'UNDER_REVIEW').reduce((sum, m) => sum + m.amount, 0);
    const heldAmount = totalFundedAmount - totalReleased;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Escrow Security Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Track funds securely locked and pending deliverables.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Total Escrow Funded</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">${totalFundedAmount.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Held (Active Escrow)</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">${heldAmount.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Pending PM Approval</p>
                            <p className="text-3xl font-bold text-amber-600 mt-2">${pendingApproval.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Released Output</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-2">${totalReleased.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-between items-center mt-8 mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Active Escrow Projects</h2>
                </div>

                <Card>
                    <div className="divide-y divide-slate-100">
                        {isLoading && <div className="p-8 text-center text-slate-500">Loading escrow metrics...</div>}

                        {!isLoading && milestones.filter(m => m.status !== 'PENDING').length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No active funds locked in escrow.</div>
                        )}

                        {milestones.filter(m => m.status !== 'PENDING').map(m => (
                            <div key={m.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-slate-900">{m.title}</h3>
                                        <MilestoneStatusBadge status={m.status} />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Vendor: WebTech Freelancers</p>
                                    <p className="text-xs font-medium text-slate-700 mt-2">Locked Limit: ${m.amount.toLocaleString()} {m.currency}</p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Link href={`/corporate/projects/${projectId}/milestones/${m.id}`}>
                                        <Button variant="outline" className="gap-2 border-slate-300">View Timeline <Activity size={16} /></Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
