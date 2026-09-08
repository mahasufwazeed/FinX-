"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, Activity, CheckCircle, Clock } from "lucide-react";

export default function CorporateDashboard() {
    const stats = [
        { name: "Total Projects", value: "12", icon: Briefcase, change: "+2 this month" },
        { name: "Active Projects", value: "4", icon: Activity, change: "2 awaiting action" },
        { name: "Total Funded Amount", value: "$45,000", icon: CheckCircle, change: "Across 4 active projects" },
        { name: "Pending Milestones", value: "7", icon: Clock, change: "3 need approval" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Corporate Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your projects, milestones, and escrow funds.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.name}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                                            <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                                        </div>
                                        <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-slate-600">
                                        {stat.change}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Recent Activity</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Funded Milestone 1: Design Phase</p>
                                <p className="text-xs text-slate-500">Project: Website Redesign</p>
                            </div>
                            <span className="text-sm text-slate-500">2 hours ago</span>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Created New Project</p>
                                <p className="text-xs text-slate-500">Project: Mobile App Development</p>
                            </div>
                            <span className="text-sm text-slate-500">Yesterday</span>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
