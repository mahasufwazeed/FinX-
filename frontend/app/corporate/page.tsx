"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CorporateDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const projectId = 'proj-demo-1'; // Mocking single project for now

    useEffect(() => {
        milestoneService.getProjectMilestones(projectId)
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, []);

    const pendingCount = milestones.filter(m => m.status === 'PENDING').length;
    const approvedCount = milestones.filter(m => m.status === 'APPROVED').length;
    const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Corporate Projects</h1>
                    <p className="text-sm text-slate-500 mt-1">Track milestone deliverables, progress, and escrow states.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Milestone Value</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${totalValue.toLocaleString()}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Unfunded (Pending)</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{pendingCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">PM Approved</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{approvedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-50 flex items-center justify-center rounded-full text-green-600">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-between items-center mt-8 mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Project Milestones: Alpha Development</h2>
                </div>

                <Card>
                    <div className="divide-y divide-slate-100">
                        {isLoading && <div className="p-8 text-center text-slate-500">Loading milestones from API...</div>}

                        {!isLoading && milestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No milestones found.</div>
                        )}

                        {milestones.map(m => (
                            <div key={m.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-slate-900">{m.title}</h3>
                                        <MilestoneStatusBadge status={m.status} />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{m.description}</p>
                                    <p className="text-xs font-medium text-slate-700 mt-2">Value: ${m.amount.toLocaleString()} {m.currency}</p>
                                </div>
                                <div className="flex shrink-0">
                                    <Link href={`/corporate/projects/${projectId}/milestones/${m.id}`}>
                                        <Button variant="outline" className="gap-2">View Details <ArrowRight size={16} /></Button>
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
