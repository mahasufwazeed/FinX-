"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Briefcase, Activity, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { name: "Total Users", value: "1,248", icon: Users, change: "+12 this week" },
        { name: "Total Deals", value: "324", icon: Briefcase, change: "+8 this week" },
        { name: "Payment Volume", value: "$1.2M", icon: Activity, change: "All time" },
        { name: "Pending Disputes", value: "2", icon: AlertTriangle, change: "Requires attention" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Platform metrics, user oversight, and escalation management.</p>
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

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Recent Escrow Transactions</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-slate-900">$5,000 Released</p>
                                <p className="text-xs text-slate-500">Milestone 2 - App Dev Deal</p>
                            </div>
                            <span className="text-sm text-slate-500">10 mins ago</span>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-slate-900">$2,500 Held in Escrow</p>
                                <p className="text-xs text-slate-500">Milestone 1 - Design Services</p>
                            </div>
                            <span className="text-sm text-slate-500">1 hour ago</span>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
