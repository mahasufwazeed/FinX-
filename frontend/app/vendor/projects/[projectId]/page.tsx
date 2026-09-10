"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { dealService } from "@/services/deal.service";
import { Deal } from "@/types";
import { ArrowLeft, RefreshCw, AlertCircle, Calendar, DollarSign, User, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export default function VendorProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;

    const [deal, setDeal] = useState<Deal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchDeal = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await dealService.getDealById(projectId);
            setDeal(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "Failed to fetch deal details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchDeal();
        }
    }, [projectId]);

    const handleAcceptDeal = async () => {
        if (!deal) return;
        setIsAccepting(true);
        setActionError(null);
        setActionSuccess(null);
        try {
            const updated = await dealService.acceptDeal(deal.id);
            setDeal(updated);
            setActionSuccess("Deal accepted successfully! Deal status is now ACTIVE.");
        } catch (err: any) {
            setActionError(err?.response?.data?.message || err.message || "Failed to accept deal");
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDeclineDeal = async () => {
        if (!deal) return;
        const confirm = window.confirm("Are you sure you want to decline this deal?");
        if (!confirm) return;

        setIsDeclining(true);
        setActionError(null);
        setActionSuccess(null);
        try {
            const updated = await dealService.cancelDeal(deal.id);
            setDeal(updated);
            setActionSuccess("Deal declined and marked as CANCELLED.");
        } catch (err: any) {
            setActionError(err?.response?.data?.message || err.message || "Failed to decline deal");
        } finally {
            setIsDeclining(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
            PENDING_ACCEPTANCE: "bg-amber-100 text-amber-700 border-amber-200",
            ACTIVE: "bg-blue-100 text-blue-700 border-blue-200",
            COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
            CANCELLED: "bg-red-100 text-red-700 border-red-200",
            DISPUTED: "bg-orange-100 text-orange-700 border-orange-200"
        };
        const defaultStyle = "bg-slate-100 text-slate-700 border-slate-200";
        return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${styles[status] || defaultStyle}`}>
                {status.replace("_", " ")}
            </span>
        );
    };

    const canRespond = deal && deal.status === 'PENDING_ACCEPTANCE';

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-3 text-slate-500 hover:text-slate-900">
                    <ArrowLeft size={16} /> Back to Projects
                </Button>

                {error && (
                    <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg flex flex-col items-center">
                        <AlertCircle className="mb-2" size={24} />
                        <p>{error}</p>
                        <Button variant="outline" className="mt-4" onClick={fetchDeal}>Try Again</Button>
                    </div>
                )}

                {actionSuccess && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-3 text-sm">
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        <p>{actionSuccess}</p>
                    </div>
                )}

                {actionError && (
                    <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center gap-3 text-sm">
                        <AlertCircle size={18} className="text-red-500 shrink-0" />
                        <p>{actionError}</p>
                    </div>
                )}

                {!error && isLoading && (
                    <div className="p-24 text-center text-slate-500 flex flex-col items-center">
                        <RefreshCw size={32} className="animate-spin text-blue-500 mb-4" />
                        <p>Loading project details...</p>
                    </div>
                )}

                {!error && !isLoading && deal && (
                    <>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">{deal.title}</h1>
                                <p className="text-slate-500 mt-2 font-mono text-xs">ID: {deal.id}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={deal.status} />
                                {canRespond && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleAcceptDeal}
                                            disabled={isAccepting || isDeclining}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                        >
                                            <CheckCircle2 size={15} />
                                            {isAccepting ? "Accepting..." : "Accept Deal"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDeclineDeal}
                                            disabled={isAccepting || isDeclining}
                                            className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                                        >
                                            <XCircle size={15} />
                                            {isDeclining ? "Declining..." : "Decline Deal"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {canRespond && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
                                <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">Action Required: Deal Acceptance Pending</p>
                                    <p className="text-amber-700 mt-0.5">
                                        The corporate buyer has offered you this project. Review terms and amount below, then click &quot;Accept Deal&quot; to activate it.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                        <DollarSign size={18} className="text-blue-500" /> Financials
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Amount</p>
                                        <p className="text-2xl font-bold text-slate-900">${deal.totalAmount?.toLocaleString()} <span className="text-sm text-slate-500">{deal.currency}</span></p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                        <Calendar size={18} className="text-blue-500" /> Timeline
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Assigned Date</p>
                                        <p className="text-base text-slate-900">{new Date(deal.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Last Updated</p>
                                        <p className="text-base text-slate-900">{new Date(deal.updatedAt).toLocaleString()}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                        <User size={18} className="text-blue-500" /> Parties Involved
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Buyer (Corporate) ID</p>
                                        <p className="text-xs font-mono text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-200 select-all">{deal.buyerId}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Your Vendor ID</p>
                                        <p className="text-xs font-mono text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-200 select-all">{deal.sellerId}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                        <ShieldCheck size={18} className="text-blue-500" /> Project Details
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-slate-700 whitespace-pre-wrap">{deal.description}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="pt-8 border-t border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Milestones & Deliverables</h2>
                            <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
                                <CardContent className="p-8 text-center text-slate-500">
                                    Deliverable submissions will be unlocked when the milestone backend API is deployed.
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
