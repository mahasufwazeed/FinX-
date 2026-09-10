"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { dealService } from "@/services/deal.service";
import { milestoneService } from "@/services/milestone.service";
import { Deal, Milestone } from "@/types";
import { Activity, BarChart2, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export default function ProjectManagerReportsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            dealService.getDeals().catch(() => []),
            milestoneService.getAllMilestones().catch(() => [])
        ])
            .then(([dealsData, milestonesData]) => {
                setDeals(Array.isArray(dealsData) ? dealsData : []);
                setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m =>
        m.status === "RELEASED" || (m.status as string) === "COMPLETED"
    ).length;
    const inProgressMilestones = milestones.filter(m => m.status === "IN_PROGRESS").length;
    const underReviewMilestones = milestones.filter(m => m.status === "UNDER_REVIEW").length;

    const completionRate = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 100;

    const totalBudget = deals.reduce((sum, d) => sum + (Number(d.totalAmount) || 0), 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Delivery Analytics</h1>
                    <p className="text-sm text-slate-500 mt-1">Cross-deal milestone completion velocity and vendor execution benchmarks.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Milestone Delivery Rate</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">{completionRate}%</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Under Active Review</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-2">{underReviewMilestones}</p>
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
                                    <p className="text-sm font-medium text-slate-500">In Active Execution</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{inProgressMilestones}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <Activity size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Committed Portfolio</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-2">
                                        ₹{totalBudget.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-purple-50 flex items-center justify-center rounded-full text-purple-600">
                                    <BarChart2 size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <BarChart2 size={20} className="text-blue-600" />
                                Milestone Status Distribution
                            </h2>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-600">Total Tracked Milestones</span>
                                    <span className="text-sm font-bold text-slate-900">{totalMilestones}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-600">Delivered & Released</span>
                                    <span className="text-sm font-bold text-emerald-600">{completedMilestones}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-600">Pending Review</span>
                                    <span className="text-sm font-bold text-amber-600">{underReviewMilestones}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-600">In Progress</span>
                                    <span className="text-sm font-bold text-blue-600">{inProgressMilestones}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-emerald-600" />
                                Quality & Acceptance Guarantees
                            </h2>
                            <p className="text-sm text-slate-500">
                                Operating principles enforced by FINX automated escrow state machine.
                            </p>
                            <div className="space-y-2 pt-2 text-sm text-slate-700">
                                <p>• Escrow deposits are strictly locked before vendor milestone execution commences.</p>
                                <p>• Deliverables require buyer sign-off or dispute resolution prior to fund disbursement.</p>
                                <p>• Every milestone approval triggers atomic ledger credit and releases fiat funds exactly once.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}