"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { financeService } from "@/services/day6.service";
import { Banknote, FileWarning } from "lucide-react";

export default function FinanceTransactionsPage() {
    const [txs, setTxs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        financeService.getTransactions().then(setTxs).finally(() => setIsLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Master Ledger & Settlements</h1>
                    <p className="text-sm text-slate-500 mt-1">Review locked fiat deposits and final payouts. Sensitives are strictly masked.</p>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">ID & Type</th>
                                    <th className="p-4 font-semibold text-slate-600">Date</th>
                                    <th className="p-4 font-semibold text-slate-600">Gross Value</th>
                                    <th className="p-4 font-semibold text-slate-600">Bank Ref (Masked)</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Settlement Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Querying secure ledger...</td></tr>}
                                {!isLoading && txs.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No active financial settlements found.</td></tr>
                                )}
                                {!isLoading && txs.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-mono text-xs">
                                            <span className="font-semibold text-slate-900 mb-1 block truncate max-w-[200px]" title={tx.id}>{tx.id}</span>
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded uppercase text-[10px] font-medium">{tx.provider || 'FIAT ESCROW'}</span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">{new Date(tx.createdAt || tx.date || Date.now()).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-slate-900">{tx.currency || 'USD'} {Number(tx.amount || tx.grossAmount || 0).toLocaleString()}</td>
                                        <td className="p-4 font-mono text-xs text-slate-500 border-l border-slate-100 truncate max-w-[180px]">
                                            {tx.providerOrderId || tx.providerPaymentId || 'ESCROW-LEDGER'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {tx.status === 'SUCCESS' || tx.status === 'PAYMENT_SUCCESS' ? (
                                                <span className="text-emerald-600 font-medium">COMPLETED</span>
                                            ) : tx.status === 'FAILED' ? (
                                                <span className="text-rose-600 font-medium">FAILED</span>
                                            ) : (
                                                <span className="text-amber-600 font-medium">{tx.status || 'PENDING'}</span>
                                            )}
                                        </td>
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
