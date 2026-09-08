"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { DollarSign, Clock, CheckCircle, FileSpreadsheet } from "lucide-react";

export default function FinanceDashboard() {
    const stats = [
        { name: "Total Payment Volume", value: "$4.2M", icon: DollarSign, change: "All time" },
        { name: "Pending Payments", value: "$125k", icon: Clock, change: "Accrued this week" },
        { name: "Completed Payments", value: "342", icon: CheckCircle, change: "Successfully processed" },
        { name: "Invoice Count", value: "12", icon: FileSpreadsheet, change: "Requires reconciliation" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Finance & Accounts Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Review payment volumes, track escrow release requests, and reconcile invoices.</p>
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

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Pending Escrow Releases</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Release Request: $15,000</p>
                                <p className="text-xs text-slate-500">Project: Frontend MVP Milestone 1</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                    Awaiting Finance Verifcation
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
