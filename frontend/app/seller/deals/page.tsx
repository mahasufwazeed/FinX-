"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEscrowStore } from "@/store/useEscrowStore";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function SellerDealsPage() {
    const { deals, milestones, submitWork } = useEscrowStore();
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Assigned Deals</h1>
                    <p className="text-sm text-slate-500 mt-1">Submit work deliverables for funded milestones.</p>
                </div>

                {deals.length === 0 ? (
                    <Card className="p-12 text-center">
                        <h3 className="text-lg font-semibold text-slate-900">No deals assigned to you yet</h3>
                        <p className="text-slate-500 mt-2">Waiting for a buyer to originate a contract.</p>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {deals.map(deal => {
                            const ms = milestones.filter(m => m.dealId === deal.id);

                            return (
                                <Card key={deal.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-slate-900">{deal.title}</h3>
                                                <p className="text-sm text-slate-500 mt-1">Total contract value: ${deal.amount.toLocaleString()}</p>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                                {deal.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Project Milestones</h4>
                                            {ms.map(m => (
                                                <div key={m.id} className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center bg-white gap-4 shadow-sm">
                                                    <div className="flex-1">
                                                        <span className="text-xs font-medium text-slate-500 mb-1 block">Payout: ${m.amount.toLocaleString()}</span>
                                                        <p className="text-sm text-slate-900">{m.description}</p>
                                                        <div className="mt-2 text-xs font-medium">
                                                            {m.status === 'PENDING' && <span className="text-slate-500 flex items-center gap-1"><ShieldAlert size={12} /> Awaiting Buyer Escrow Deposit</span>}
                                                            {m.status === 'FUNDED' && <span className="text-green-600 font-bold flex items-center gap-1"><ShieldCheck size={14} /> Funds secured in Escrow! Ready to work.</span>}
                                                            {m.status === 'REVIEW' && <span className="text-yellow-600 font-bold">Work under review by buyer...</span>}
                                                            {m.status === 'RELEASED' && <span className="text-blue-600 font-bold">Payment Released to Wallet</span>}
                                                            {m.status === 'DISPUTED' && <span className="text-red-500 font-bold">Disputed by Buyer!</span>}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {m.status === 'FUNDED' && (
                                                            <Button onClick={() => user && submitWork(m.id, user.id)} size="sm">
                                                                Submit Work for Approval
                                                            </Button>
                                                        )}
                                                        {m.status === 'DISPUTED' && (
                                                            <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                                                                Resolve Dispute
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
