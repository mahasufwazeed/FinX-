"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Activity, Lock, Unlock, ShieldAlert } from "lucide-react";
import { useEscrowStore } from "@/store/useEscrowStore";

export default function AdminDashboard() {
    const { escrows, milestones, releaseEscrow } = useEscrowStore();

    const approvedMilestones = milestones.filter(m => m.status === 'APPROVED');
    const releasedEscrows = escrows.filter(e => e.status === 'RELEASED');
    const heldEscrows = escrows.filter(e => e.status === 'HELD');

    const heldVolume = heldEscrows.reduce((acc, e) => acc + e.amount, 0);

    const handleRelease = (milestoneId: string, amount: number) => {
        if (confirm(`ADMIN OVERRIDE: Are you sure you want to release $${amount} to the Vendor wallet?`)) {
            releaseEscrow(milestoneId);
            alert('Escrow smart contract triggered. Fiat transferred successfully.');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">FINX Master Console</h1>
                    <p className="text-sm text-slate-500 mt-1">Platform operations, liquidity volume, and Escrow Contract executions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Active Escrow Holdings</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">${heldVolume.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <Lock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Actionable PM Approvals</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{approvedMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <ShieldAlert size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Completed Transactions</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{releasedEscrows.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <Unlock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Cryptographic Escrow Pipeline (Pending Release)</h2>
                <Card className="border-blue-300">
                    <div className="divide-y divide-slate-100">
                        {approvedMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No approved milestones in queue to release.</div>
                        )}
                        {approvedMilestones.map((m) => (
                            <div key={m.id} className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{m.description} <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">PM Approved</span></p>
                                    <p className="text-xs text-slate-500 mt-1">Escrow Vault Payload: ${m.amount.toLocaleString()}</p>
                                </div>
                                <Button onClick={() => handleRelease(m.id, m.amount)} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                    <Unlock size={16} /> Execute Escrow Transfer
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Recent Settlements</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        {releasedEscrows.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No settled transactions yet.</div>
                        )}
                        {releasedEscrows.map((e) => (
                            <div key={e.id} className="p-4 flex items-center justify-between bg-slate-50">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Settled: ${e.amount.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 font-mono">TX-ID: {e.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
