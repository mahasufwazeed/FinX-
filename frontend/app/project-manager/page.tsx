"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Activity, ListTodo, ShieldAlert, ArrowRight } from "lucide-react";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ProjectManagerDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, []);

    const reviewCount = milestones.filter(m => m.status === 'UNDER_REVIEW').length;
    const rejectedCount = milestones.filter(m => m.status === 'REJECTED').length;
    const approvedCount = milestones.filter(m => m.status === 'APPROVED').length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Manager Operations</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit vendor deliverables and sign-off on milestones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Requires Review</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{reviewCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <ListTodo size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Rejected by You</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{rejectedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-red-50 flex items-center justify-center rounded-full text-red-600">
                                    <ShieldAlert size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Approved (Pending Escrow)</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{approvedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <Activity size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestone Review Queue</h2>
                <Card className="border-amber-200">
                    <div className="divide-y divide-slate-100">
                        {isLoading && <div className="p-8 text-center text-slate-500">Syncing with Backend...</div>}

                        {!isLoading && milestones.filter(m => ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(m.status)).length === 0 && (
                            <div className="p-4 text-sm text-slate-500">Inbox zero! No milestones currently need attention.</div>
                        )}

                        {milestones.filter(m => ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(m.status)).map((m) => (
                            <div key={m.id} className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                                        <MilestoneStatusBadge status={m.status} />
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">Has {m.deliverables?.length || 0} files. Amount: ${m.amount.toLocaleString()} {m.currency}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/project-manager/reviews/${m.id}`}>
                                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                            Perform Review <ArrowRight size={16} className="ml-2" />
                                        </Button>
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
