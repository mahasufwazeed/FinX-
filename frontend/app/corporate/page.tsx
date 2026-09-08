"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, CreditCard, ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react";
import { milestoneService } from "@/services/milestone.service";
import { paymentService } from "@/services/payment.service";
import { Milestone, Payment } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CorporateDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const projectId = 'proj-demo-1';

    useEffect(() => {
        Promise.all([
            milestoneService.getProjectMilestones(projectId),
            paymentService.getBuyerPayments()
        ]).then(([m, p]) => {
            setMilestones(m);
            setPayments(p);
        }).finally(() => setIsLoading(false));
    }, []);

    const totalFunded = milestones.filter(m => m.status !== 'PENDING').reduce((sum, m) => sum + m.amount, 0);
    const releasedAmount = milestones.filter(m => m.status === 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const pendingPayments = milestones.filter(m => m.status === 'PENDING').reduce((sum, m) => sum + m.amount, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Corporate Buyer Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Track active projects, escrow funding, and payment history.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Projects</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
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
                                    <p className="text-sm font-medium text-slate-500">Funded in Escrow</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">${totalFunded.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Release Pipeline</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${releasedAmount.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-purple-50 flex items-center justify-center rounded-full text-purple-600">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Pending Payables</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${pendingPayments.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <ShieldAlert size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
                        </div>
                        <Card>
                            <div className="divide-y divide-slate-100">
                                {isLoading && <div className="p-8 text-center text-slate-500">Loading...</div>}
                                {!isLoading && (
                                    <div className="p-6 flex items-center justify-between hover:bg-slate-50 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Alpha Development</h3>
                                            <p className="text-sm text-slate-500 mt-1">Vendor: WebTech Freelancers</p>
                                        </div>
                                        <div className="flex shrink-0">
                                            <Link href={`/corporate/projects/${projectId}/payments`}>
                                                <Button className="bg-slate-900 text-white gap-2">Fund Escrow <ArrowRight size={16} /></Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Payments</h2>
                            <Link href="/corporate/payments" className="text-sm text-blue-600 hover:underline">View All</Link>
                        </div>
                        <Card>
                            <div className="divide-y divide-slate-100">
                                {isLoading && <div className="p-4 text-center text-slate-500 text-sm">Loading activity...</div>}
                                {!isLoading && payments.length === 0 && <div className="p-4 text-center text-slate-500 text-sm">No recent transactions.</div>}
                                {!isLoading && payments.slice(0, 4).map(p => (
                                    <div key={p.id} className="p-4 flex justify-between items-center bg-slate-50">
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm">${p.amount.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            {p.status === 'PAYMENT_SUCCESS' ? (
                                                <span className="text-xs font-semibold text-emerald-600">Verified</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-slate-500">{p.status}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
