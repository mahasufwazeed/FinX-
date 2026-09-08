"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { paymentService } from "@/services/payment.service";
import { milestoneService } from "@/services/milestone.service";
import { Payment, Milestone } from "@/types";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";

export default function ProjectPayments() {
    const { projectId } = useParams();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            paymentService.getProjectPayments(projectId as string),
            milestoneService.getProjectMilestones(projectId as string)
        ]).then(([pData, mData]) => {
            setPayments(pData);
            setMilestones(mData);
        }).finally(() => setIsLoading(false));
    }, [projectId]);

    const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);
    const fundedMilestones = milestones.filter(m => m.status !== 'PENDING');
    const fundedValue = fundedMilestones.reduce((sum, m) => sum + m.amount, 0);
    const remainingValue = totalValue - fundedValue;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Funding Hub</h1>
                    <p className="text-sm text-slate-500 mt-1">Review locked balances and fund pending milestones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Total Project Value</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">${totalValue.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Currently Funded</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-2">${fundedValue.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-slate-500">Remaining to Fund</p>
                            <p className="text-3xl font-bold text-amber-600 mt-2">${remainingValue.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestone Funding Schedule</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        {isLoading && <div className="p-8 text-center text-slate-500">Loading schedule...</div>}

                        {!isLoading && milestones.map(m => (
                            <div key={m.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-slate-900">{m.title}</h3>
                                        {m.status === 'PENDING' ? (
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">Not Funded</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">Secured in Escrow</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 mt-2">Amount: ${m.amount.toLocaleString()} {m.currency}</p>
                                </div>
                                <div className="flex shrink-0">
                                    <Link href={`/corporate/projects/${projectId}/milestones/${m.id}/payment`}>
                                        {m.status === 'PENDING' ? (
                                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"><Wallet size={16} /> Fund Milestone</Button>
                                        ) : (
                                            <Button variant="outline" className="gap-2">View Funding <ArrowRight size={16} /></Button>
                                        )}
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
