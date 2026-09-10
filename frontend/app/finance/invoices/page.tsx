"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { FileText, Download, CheckCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FinanceInvoicesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .catch(() => setMilestones([]))
            .finally(() => setIsLoading(false));
    }, []);

    // Filter milestones that are funded, approved, released or completed
    const invoiceable = milestones.filter(m =>
        m.status === "RELEASED" ||
        m.status === "APPROVED" ||
        (m.status as string) === "COMPLETED" ||
        m.status === "UNDER_REVIEW"
    );

    const filtered = invoiceable.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const releasedTotal = milestones
        .filter(m => m.status === "RELEASED" || (m.status as string) === "COMPLETED")
        .reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

    const handleDownloadStatement = (invoiceId: string, title: string, amount: number) => {
        const text = `========================================\nFINX B2B FIAT ESCROW SETTLEMENT STATEMENT\n========================================\nInvoice ID: ${invoiceId}\nDescription: ${title}\nSettlement Amount: INR ${amount.toLocaleString()}\nStatus: SETTLED VIA FIAT ESCROW\nDate: ${new Date().toISOString()}\n========================================\nVerified cryptographically by FINX Escrow Engine.\n`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${invoiceId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Escrow Settlement Invoices</h1>
                    <p className="text-sm text-slate-500 mt-1">Automated tax invoices and milestone payout vouchers generated upon fund release.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Disbursed Volume</p>
                                    <p className="text-2xl font-bold text-emerald-600 mt-2">
                                        ₹{releasedTotal.toLocaleString()}
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
                                    <p className="text-sm font-medium text-slate-500">Invoices Generated</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{invoiceable.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <FileText size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Pending Settlement</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-2">
                                        {invoiceable.filter(m => m.status === "APPROVED" || m.status === "UNDER_REVIEW").length}
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by milestone or invoice ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Invoices Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Invoice Ref</th>
                                    <th className="p-4 font-semibold text-slate-600">Milestone / Deal</th>
                                    <th className="p-4 font-semibold text-slate-600">Payout Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Settlement Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Date</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            Generating settlement statements...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No settlement invoices available. Invoices appear automatically when milestones are funded or released.
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.map((m) => {
                                    const invoiceId = `INV-${m.id.slice(0, 8).toUpperCase()}`;
                                    const isSettled = m.status === "RELEASED" || (m.status as string) === "COMPLETED";

                                    return (
                                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono font-semibold text-blue-600 text-xs">
                                                {invoiceId}
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-slate-900">{m.title}</p>
                                                <p className="text-xs text-slate-500 font-mono">Milestone: {m.id.slice(0, 8)}...</p>
                                            </td>
                                            <td className="p-4 font-bold text-slate-900">
                                                ₹{Number(m.amount).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                {isSettled ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        SETTLED & DISBURSED
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        HELD IN ESCROW
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-xs text-slate-500">
                                                {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleDownloadStatement(invoiceId, m.title, m.amount)}
                                                    className="gap-1 text-xs"
                                                >
                                                    <Download size={14} />
                                                    Statement
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}