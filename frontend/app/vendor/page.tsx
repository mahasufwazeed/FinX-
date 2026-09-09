"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, Activity, ArrowRight, RefreshCw } from "lucide-react";
import { dealService } from "@/services/deal.service";
import { Deal } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function VendorDashboard() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dealService.getDeals()
            .then(setDeals)
            .finally(() => setIsLoading(false));
    }, []);

    const totalDeals = deals.length;
    const activeDeals = deals.filter(d => d.status === 'ACTIVE').length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Contracts & Deals</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage assigned deals and deliverables.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Deals Assigned</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalDeals}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Active Deals</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">{activeDeals}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <Activity size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4 mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">Assigned Deals</h2>
                        <Link href="/vendor/projects" className="text-sm text-blue-600 hover:underline">View All</Link>
                    </div>

                    <Card>
                        <div className="divide-y divide-slate-100">
                            {isLoading && <div className="p-8 text-center text-slate-500"><RefreshCw size={24} className="animate-spin mx-auto text-blue-500" /></div>}

                            {!isLoading && deals.length === 0 && (
                                <div className="p-4 text-sm text-slate-500 text-center py-8">No deals currently assigned to you.</div>
                            )}

                            {!isLoading && deals.slice(0, 5).map(m => (
                                <div key={m.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-slate-900">{m.title}</h3>
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                                                {m.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1 max-w-xl truncate">{m.description}</p>
                                    </div>
                                    <div className="flex shrink-0">
                                        <Link href={`/vendor/projects/${m.id}`}>
                                            <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                                Open Workspace <ArrowRight size={16} />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
