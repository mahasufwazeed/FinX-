"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, Activity, CheckSquare, ListTodo } from "lucide-react";

export default function ProjectManagerDashboard() {
    const stats = [
        { name: "Assigned Projects", value: "8", icon: Briefcase, change: "Active tracking" },
        { name: "Pending Reviews", value: "5", icon: ListTodo, change: "Requires attention" },
        { name: "Milestones Awaiting Approval", value: "3", icon: CheckSquare, change: "Ready for sign-off" },
        { name: "Project Progress", value: "64%", icon: Activity, change: "Average completion rate" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Manager Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Track projects, review deliverables, and approve milestones.</p>
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

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestones Awaiting Approval</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Database Schema Design</p>
                                <p className="text-xs text-slate-500">Project: Inventory System Migration</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    Ready to Review
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
