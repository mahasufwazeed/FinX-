"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { disputeService } from "@/services/dispute.service";
import { Dispute } from "@/types";
import { ShieldAlert, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const loadDisputes = () => {
        setIsLoading(true);
        disputeService.getAllDisputes()
            .then(data => setDisputes(data || []))
            .catch(() => setFeedback({ type: 'error', message: 'Failed to load arbitration disputes from backend.' }))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadDisputes();
    }, []);

    const handleResolve = async (disputeId: string) => {
        if (!resolutionNotes.trim()) {
            setFeedback({ type: 'error', message: 'Please provide resolution arbitration notes.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await disputeService.resolveDispute(disputeId, resolutionNotes);
            setFeedback({ type: 'success', message: 'Dispute has been successfully resolved and audited.' });
            setResolvingId(null);
            setResolutionNotes("");
            loadDisputes();
        } catch (err: any) {
            setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to resolve dispute.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Legal Disputes & Arbitration</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Administrative oversight for contested escrow milestones and deal default claims.
                    </p>
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Dispute ID</th>
                                    <th className="p-4 font-semibold text-slate-600">Deal Reference</th>
                                    <th className="p-4 font-semibold text-slate-600">Contestation Reason</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Arbitration Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            Loading disputes from arbitration engine...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && disputes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <h3 className="font-semibold text-slate-900">Zero Active Disputes</h3>
                                                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                                                    All fiat escrow deals are executing cleanly. Contested milestones will appear here for admin ruling.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && disputes.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-mono text-xs text-slate-600">
                                            <span className="font-semibold text-slate-900 block truncate max-w-[150px]" title={d.id}>
                                                {d.id}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(d.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600 truncate max-w-[160px]" title={d.dealId}>
                                            {d.dealId}
                                        </td>
                                        <td className="p-4 text-xs text-slate-700 max-w-xs">
                                            <p className="font-medium text-slate-900 line-clamp-2">{d.reason}</p>
                                            {d.resolutionNotes && (
                                                <p className="text-[11px] text-emerald-700 mt-1 italic">
                                                    Resolution: {d.resolutionNotes}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {d.status === "RESOLVED" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 size={12} /> Resolved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                    <Clock size={12} /> Under Review
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {d.status !== "RESOLVED" ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setResolvingId(d.id)}
                                                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                                                >
                                                    Resolve
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-mono">Settled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Dispute Resolution Dialog */}
                {resolvingId && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Arbitration Resolution</h3>
                                    <p className="text-xs text-slate-500">Record formal arbitration ruling on deal</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Resolution Ruling & Notes
                                </label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={4}
                                    placeholder="State findings, escrow disburse/refund decision, and compliance grounds..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setResolvingId(null);
                                        setResolutionNotes("");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled={isSubmitting}
                                    onClick={() => handleResolve(resolvingId)}
                                >
                                    {isSubmitting ? "Submitting Ruling..." : "Confirm & Settle Dispute"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}