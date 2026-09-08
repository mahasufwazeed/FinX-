"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Lock, Unlock, ShieldAlert, ArrowRight } from "lucide-react";
import { Milestone } from "@/types";
import { milestoneService } from "@/services/milestone.service";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, []);

    const approvedMilestones = milestones.filter(m => m.status === 'APPROVED' || m.status === 'RELEASE_PENDING');
    const releasedMilestones = milestones.filter(m => m.status === 'RELEASED');

    const heldVolume = milestones.filter(m => !['DRAFT', 'PENDING', 'RELEASED', 'REJECTED'].includes(m.status)).reduce((acc, m) => acc + m.amount, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">FINX Master Console (Escrow Operations)</h1>
                    <p className="text-sm text-slate-500 mt-1">Platform operations, liquidity volume, and Escrow Contract executions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Global Locked Volume</p>
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
                                    <p className="text-sm font-medium text-slate-500">Pending Release Queues</p>
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
                                    <p className="text-sm font-medium text-slate-500">Released Txs</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{releasedMilestones.length}</p>
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
                        {isLoading && <div className="p-8 text-center text-slate-500">Syncing ledgers...</div>}

                        {!isLoading && approvedMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No approved milestones in queue for release.</div>
                        )}

                        {approvedMilestones.map((m) => (
                            <div key={m.id} className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{m.title} <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">PM Approved</span></p>
                                    <p className="text-xs text-slate-500 mt-1">Locked Vault Payload: ${m.amount.toLocaleString()} {m.currency}</p>
                                </div>
                                <Link href={`/admin/escrow/${m.id}`}>
                                    <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                        <Unlock size={16} /> Review Escrow Payout <ArrowRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
