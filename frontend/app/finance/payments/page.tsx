"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { financeService } from "@/services/day6.service";
import { CreditCard, CheckCircle, AlertCircle, Clock, Search, Filter } from "lucide-react";

export default function FinancePaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        financeService.getTransactions()
            .then(setPayments)
            .catch(() => setPayments([]))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = payments.filter((p: any) => {
        const matchesSearch =
            (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.providerOrderId && p.providerOrderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.providerPaymentId && p.providerPaymentId.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const successCount = payments.filter((p: any) => p.status === "SUCCESS").length;
    const failedCount = payments.filter((p: any) => p.status === "FAILED").length;
    const totalAmount = payments
        .filter((p: any) => p.status === "SUCCESS")
        .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Fiat Payment Records</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit trail of all incoming gateway payment intents and verified escrow deposits.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Verified Success Volume</p>
                                    <p className="text-2xl font-bold text-emerald-600 mt-2">
                                        ₹{totalAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Successful Payments</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{successCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Failed / Rejected</p>
                                    <p className="text-3xl font-bold text-rose-600 mt-2">{failedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-rose-50 flex items-center justify-center rounded-full text-rose-600">
                                    <AlertCircle size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by Payment ID, Razorpay Order/Payment ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="ALL" className="text-slate-900 bg-white">All Payment Statuses</option>
                                    <option value="SUCCESS" className="text-slate-900 bg-white">SUCCESS</option>
                                    <option value="PENDING" className="text-slate-900 bg-white">PENDING</option>
                                    <option value="FAILED" className="text-slate-900 bg-white">FAILED</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Payment ID</th>
                                    <th className="p-4 font-semibold text-slate-600">Order & Ref</th>
                                    <th className="p-4 font-semibold text-slate-600">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Gateway</th>
                                    <th className="p-4 font-semibold text-slate-600">Date</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            Retrieving payment transactions...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No payment records found.
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono text-xs">
                                            <span className="font-semibold text-slate-900 block truncate max-w-[180px]" title={p.id}>
                                                {p.id}
                                            </span>
                                            <span className="text-slate-400 text-[10px]">Deal: {p.dealId ? p.dealId.slice(0, 8) + '...' : '—'}</span>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600">
                                            <p>{p.providerOrderId || '—'}</p>
                                            <p className="text-slate-400 text-[10px]">{p.providerPaymentId || ''}</p>
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">
                                            {p.currency || 'INR'} {Number(p.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium uppercase">
                                                {p.provider || 'RAZORPAY'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                                        </td>
                                        <td className="p-4 text-right">
                                            {p.status === "SUCCESS" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    SUCCESS
                                                </span>
                                            ) : p.status === "FAILED" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                    FAILED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    {p.status || "PENDING"}
                                                </span>
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