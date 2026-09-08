"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEscrowStore } from "@/store/useEscrowStore";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Plus, ShieldCheck, HelpCircle } from "lucide-react";

export default function BuyerDealsPage() {
    const { deals, milestones, fundMilestone, approveWork, disputeWork } = useEscrowStore();
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Your Deals</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage active projects and release funds securely.</p>
                    </div>
                    <Link href="/buyer/deals/new">
                        <Button className="gap-2"><Plus size={16} /> New Deal</Button>
                    </Link>
                </div>

                {deals.length === 0 ? (
                    <Card className="p-12 text-center flex flex-col items-center">
                        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <HelpCircle size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No active deals yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mb-6">Create your first deal to hold funds securely in escrow.</p>
                        <Link href="/buyer/deals/new">
                            <Button>Create Deal</Button>
                        </Link>
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
                                                <p className="text-sm text-slate-500 mt-1">Total value: ${deal.amount.toLocaleString()}</p>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {deal.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Milestones</h4>
                                            {ms.map(m => (
                                                <div key={m.id} className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center bg-slate-50 gap-4">
                                                    <div className="flex-1">
                                                        <span className="text-xs font-medium text-slate-500 mb-1 block">Amount: ${m.amount.toLocaleString()}</span>
                                                        <p className="text-sm text-slate-900 font-medium">{m.description}</p>
                                                        <p className="text-xs font-semibold mt-2 text-slate-500">Status: {m.status}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {m.status === 'PENDING' && (
                                                            <Button onClick={() => user && fundMilestone(m.id, user.id)} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                                                Deposit to Escrow
                                                            </Button>
                                                        )}
                                                        {m.status === 'REVIEW' && (
                                                            <>
                                                                <Button onClick={() => user && approveWork(m.id, user.id)} size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                                                                    <ShieldCheck size={14} /> Approve & Release
                                                                </Button>
                                                                <Button onClick={() => user && disputeWork(m.id, user.id)} size="sm" variant="danger">
                                                                    Dispute
                                                                </Button>
                                                            </>
                                                        )}
                                                        {m.status === 'RELEASED' && (
                                                            <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                                                                <ShieldCheck size={16} /> Paid Out
                                                            </span>
                                                        )}
                                                        {m.status === 'FUNDED' && (
                                                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded border border-blue-200">
                                                                Funds in Escrow (Awaiting Seller Work)
                                                            </span>
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
