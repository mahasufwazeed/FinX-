"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { ShieldAlert, FileWarning, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { disputeService } from "@/services/dispute.service";
import { dealService } from "@/services/deal.service";
import { Dispute, Deal } from "@/types";

export default function BuyerDisputesPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDealId, setSelectedDealId] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const myDeals = await dealService.getDeals();
            const dealList = Array.isArray(myDeals) ? myDeals : [];
            setDeals(dealList);

            // Fetch disputes across my deals
            const disputesPromises = dealList.map(d => disputeService.getDisputesForDeal(d.id).catch(() => []));
            const allDisputesNested = await Promise.all(disputesPromises);
            const flat = allDisputesNested.flat();
            setDisputes(flat);
        } catch {
            // Handled gracefully
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateDispute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDealId || !reason.trim()) {
            setFeedback({ type: 'error', message: 'Please select a deal and provide a reason.' });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);
        try {
            await disputeService.createDispute({
                dealId: selectedDealId,
                reason: reason.trim()
            });
            setFeedback({ type: 'success', message: 'Dispute successfully filed. Escrow disbursement has been frozen pending arbitration.' });
            setIsModalOpen(false);
            setSelectedDealId("");
            setReason("");
            loadData();
        } catch (err: any) {
            setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to raise dispute.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Legal Disputes & Arbitration</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage contestations on escrow releases and vendor default.</p>
                    </div>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white gap-2"
                    >
                        <ShieldAlert size={16} /> Raise New Dispute
                    </Button>
                </div>

                {feedback && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
                        feedback.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                        {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span>{feedback.message}</span>
                    </div>
                )}

                <Card>
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-500">Checking arbitration records...</div>
                    ) : disputes.length === 0 ? (
                        <CardContent className="p-16 text-center text-slate-500 flex flex-col items-center">
                            <FileWarning size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No Active Disputes</h3>
                            <p className="mt-2 text-sm max-w-sm">
                                You currently have no contested milestones. The FINX arbitration engine protects all fiat escrow vaults.
                            </p>
                        </CardContent>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 font-semibold text-slate-600">Dispute ID</th>
                                        <th className="p-4 font-semibold text-slate-600">Deal Reference</th>
                                        <th className="p-4 font-semibold text-slate-600">Contestation Ground</th>
                                        <th className="p-4 font-semibold text-slate-600">Arbitration Status</th>
                                        <th className="p-4 font-semibold text-slate-600">Date Filed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {disputes.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50">
                                            <td className="p-4 font-mono text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                                                {d.id}
                                            </td>
                                            <td className="p-4 font-mono text-xs text-slate-600 truncate max-w-[150px]">
                                                {d.dealId}
                                            </td>
                                            <td className="p-4 text-xs text-slate-800 max-w-sm">
                                                <p className="font-medium text-slate-900">{d.reason}</p>
                                                {d.resolutionNotes && (
                                                    <p className="text-[11px] text-emerald-700 mt-1">
                                                        Admin Resolution: {d.resolutionNotes}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {d.status === 'RESOLVED' ? (
                                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                                                        Resolved
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold">
                                                        Under Arbitration
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-xs text-slate-500">
                                                {new Date(d.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Modal to file dispute */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Raise Legal Dispute</h3>
                                    <p className="text-xs text-slate-500">Freeze deal funds and escalate to FINX arbiters</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateDispute} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Select Contested Deal
                                    </label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={selectedDealId}
                                        onChange={(e) => setSelectedDealId(e.target.value)}
                                        required
                                    >
                                        <option value="" className="text-slate-900 bg-white">-- Choose Deal --</option>
                                        {deals.map(d => (
                                            <option key={d.id} value={d.id} className="text-slate-900 bg-white">
                                                {d.title} (${Number(d.totalAmount).toLocaleString()} - {d.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Contestation Grounds & Detailed Reason
                                    </label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                        rows={4}
                                        placeholder="Detail deliverable deficiencies, non-performance, or contractual breach..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setSelectedDealId("");
                                            setReason("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Filing Dispute..." : "Submit Formal Dispute"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
