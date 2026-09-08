"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, Activity, CheckCircle, Clock, ShieldCheck } from "lucide-react";
import { useEscrowStore } from "@/store/useEscrowStore";

export default function CorporateDashboard() {
    const { projects, milestones, depositEscrow } = useEscrowStore();

    const handleRazorpayDeposit = (milestoneId: string, amount: number) => {
        // Mocking Razorpay Window
        alert(`Opening securely encrypted Razorpay gateway to deposit: $${amount}`);
        setTimeout(() => {
            depositEscrow(milestoneId);
            alert('Payment Success! Escrow securely funded.');
        }, 1000);
    };

    const pendingMilestones = milestones.filter(m => m.status === 'PENDING');
    const fundedMilestones = milestones.filter(m => m.status === 'FUNDED');

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Corporate Origination</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your projects, milestones, and fund escrows via Razorpay.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Active Projects</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{projects.length}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Awaiting Funds</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{pendingMilestones.length}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Funded in Escrow</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{fundedMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-50 flex items-center justify-center rounded-full text-green-600">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestones Awaiting Escrow Deposit</h2>
                <Card className="border-amber-200">
                    <div className="divide-y divide-slate-100">
                        {pendingMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No milestones awaiting funds.</div>
                        )}
                        {pendingMilestones.map(milestone => (
                            <div key={milestone.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{milestone.description}</p>
                                    <p className="text-xs text-slate-500">Amount required: ${milestone.amount.toLocaleString()}</p>
                                </div>
                                <Button onClick={() => handleRazorpayDeposit(milestone.id, milestone.amount)} size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                    Deposit via Razorpay
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Actively Funded Milestones</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        {fundedMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No active milestones in escrow.</div>
                        )}
                        {fundedMilestones.map(milestone => (
                            <div key={milestone.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{milestone.description}</p>
                                    <p className="text-xs text-slate-500">Locked Amount: ${milestone.amount.toLocaleString()}</p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    Escrow Funded - Vendor Working
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
