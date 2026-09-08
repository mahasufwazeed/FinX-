"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { CreditCard, FileSpreadsheet, ArrowRight } from "lucide-react";
import { Milestone } from "@/types";
import { milestoneService } from "@/services/milestone.service";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FinanceDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, []);

    const releasedVolume = milestones.filter(m => m.status === 'RELEASED').reduce((acc, m) => acc + m.amount, 0);
    const pendingVolume = milestones.filter(m => m.status === 'APPROVED').reduce((acc, m) => acc + m.amount, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Finance & Analytics</h1>
                    <p className="text-sm text-slate-500 mt-1">Global audit logs, invoicing, and escrow liquidity mapping.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Liquidated (Released)</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${releasedVolume.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Liabilities (Approved, Unpaid)</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${pendingVolume.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <FileSpreadsheet size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestone Ledger Master</h2>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Ref ID</th>
                                    <th className="p-4 font-semibold text-slate-600">Title</th>
                                    <th className="p-4 font-semibold text-slate-600">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Date Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan={5} className="p-4 text-center">Loading ledger...</td></tr>}
                                {!isLoading && milestones.map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono text-xs text-slate-500">{m.id}</td>
                                        <td className="p-4 font-medium text-slate-900">{m.title}</td>
                                        <td className="p-4">${m.amount.toLocaleString()} {m.currency}</td>
                                        <td className="p-4 text-slate-600">{m.status}</td>
                                        <td className="p-4 text-slate-600">{new Date(m.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
