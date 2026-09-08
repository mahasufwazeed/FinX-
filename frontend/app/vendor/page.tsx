"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, CheckCircle, RefreshCcw, DollarSign } from "lucide-react";

export default function VendorDashboard() {
    const stats = [
        { name: "Active Projects", value: "5", icon: Briefcase, change: "1 new request" },
        { name: "Pending Deliverables", value: "3", icon: RefreshCcw, change: "Awaiting submission" },
        { name: "Completed Milestones", value: "18", icon: CheckCircle, change: "2 this week" },
        { name: "Received Payments", value: "$32,500", icon: DollarSign, change: "+$4,000 this month" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Track your active work, deliverables, and pending payments.</p>
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

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Pending Approvals</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Frontend Foundation Completed</p>
                                <p className="text-xs text-slate-500">Project: Platform MVP Development</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                    Awaiting Review
                                </span>
                                <p className="text-xs text-slate-500 mt-1">Submitted 4 hours ago</p>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Logo Design V2</p>
                                <p className="text-xs text-slate-500">Project: Brand Identity</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                    Awaiting Review
                                </span>
                                <p className="text-xs text-slate-500 mt-1">Submitted 1 day ago</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
