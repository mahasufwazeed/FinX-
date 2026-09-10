"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import { EscrowTimeline } from "@/components/escrow/EscrowTimeline";
import { Milestone } from "@/types";
import { milestoneService } from "@/services/milestone.service";
import { escrowService } from "@/services/escrow.service";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, FileCheck, CheckCircle2, XCircle, Unlock, Wallet, AlertCircle, Loader2 } from "lucide-react";

export default function CorporateMilestoneDetails() {
    const { projectId, milestoneId } = useParams();
    const router = useRouter();
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchMilestone = async () => {
        if (!milestoneId) return;
        setIsLoading(true);
        try {
            const data = await milestoneService.getMilestone(milestoneId as string);
            setMilestone(data);
        } catch (err: any) {
            setActionMessage({ type: 'error', text: err.response?.data?.message || err.message || "Failed to load milestone" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMilestone();
    }, [milestoneId]);

    const handleApprove = async () => {
        if (!milestoneId) return;
        setIsActionLoading(true);
        setActionMessage(null);
        try {
            await milestoneService.approveMilestone(milestoneId as string);
            setActionMessage({ type: 'success', text: "Milestone deliverable approved successfully!" });
            await fetchMilestone();
        } catch (err: any) {
            setActionMessage({ type: 'error', text: err.response?.data?.message || err.message || "Failed to approve milestone" });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!milestoneId) return;
        const reason = window.prompt("Enter revision feedback or reason for rejection:");
        if (!reason || !reason.trim()) return;

        setIsActionLoading(true);
        setActionMessage(null);
        try {
            await milestoneService.rejectMilestone(milestoneId as string, reason.trim());
            setActionMessage({ type: 'success', text: "Milestone returned to vendor for revision." });
            await fetchMilestone();
        } catch (err: any) {
            setActionMessage({ type: 'error', text: err.response?.data?.message || err.message || "Failed to reject milestone" });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReleaseEscrow = async () => {
        if (!milestoneId) return;
        if (!window.confirm(`Are you sure you want to release ₹${milestone?.amount?.toLocaleString()} from escrow to the vendor? This action is final.`)) {
            return;
        }

        setIsActionLoading(true);
        setActionMessage(null);
        try {
            await escrowService.releaseEscrow(milestoneId as string, "Corporate authorized escrow release upon milestone approval");
            setActionMessage({ type: 'success', text: "Escrow funds successfully released to vendor account!" });
            await fetchMilestone();
        } catch (err: any) {
            setActionMessage({ type: 'error', text: err.response?.data?.message || err.message || "Failed to release escrow funds" });
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading && !milestone) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center p-12 text-slate-500">
                    <Loader2 className="animate-spin mr-2" size={20} /> Loading milestone workspace...
                </div>
            </DashboardLayout>
        );
    }

    if (!milestone) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-slate-500">Milestone not found.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <Button variant="ghost" onClick={() => router.push(`/corporate/projects/${projectId}`)} className="gap-2 -ml-3 text-slate-500 hover:text-slate-900 mb-2">
                        <ArrowLeft size={16} /> Back to Project
                    </Button>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{milestone.title}</h1>
                            <p className="text-sm text-slate-500 mt-1">{milestone.description}</p>
                        </div>
                        <MilestoneStatusBadge status={milestone.status} />
                    </div>
                </div>

                {actionMessage && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${actionMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                        {actionMessage.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-red-600" />}
                        <span>{actionMessage.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Milestone Value</p>
                                <p className="font-semibold text-lg">₹{milestone.amount.toLocaleString()} {milestone.currency || "INR"}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-full">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Status Phase</p>
                                <p className="font-semibold">{milestone.status.replace(/_/g, ' ')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                                <FileCheck size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Deliverables</p>
                                <p className="font-semibold">{milestone.deliverables?.length || 0} Submitted</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Milestone Lifecycle Action Bar */}
                <Card className="border-slate-200">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Milestone Actions</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Manage escrow deposits, deliverable review, and fund releases.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {/* PENDING: Pay & Fund Escrow */}
                            {milestone.status === 'PENDING' && (
                                <Link href={`/corporate/projects/${projectId}/milestones/${milestoneId}/payment`}>
                                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
                                        <Wallet size={16} /> Pay & Fund Escrow
                                    </Button>
                                </Link>
                            )}

                            {/* UNDER_REVIEW or SUBMITTED: Review, Approve, Reject */}
                            {['UNDER_REVIEW', 'SUBMITTED'].includes(milestone.status) && (
                                <>
                                    <Button
                                        onClick={handleReject}
                                        disabled={isActionLoading}
                                        variant="outline"
                                        className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <XCircle size={16} /> Request Revisions
                                    </Button>
                                    <Button
                                        onClick={handleApprove}
                                        isLoading={isActionLoading}
                                        disabled={isActionLoading}
                                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <CheckCircle2 size={16} /> Approve Deliverable
                                    </Button>
                                </>
                            )}

                            {/* APPROVED: Release Escrow Funds */}
                            {milestone.status === 'APPROVED' && (
                                <Button
                                    onClick={handleReleaseEscrow}
                                    isLoading={isActionLoading}
                                    disabled={isActionLoading}
                                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                >
                                    <Unlock size={16} /> Release Escrow Funds to Vendor
                                </Button>
                            )}

                            {/* RELEASED or COMPLETED */}
                            {['RELEASED', 'COMPLETED'].includes(milestone.status) && (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                                    <CheckCircle2 size={14} className="mr-1.5" /> Escrow Funds Released to Vendor
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Vendor Deliverables</h2>
                        <Card>
                            <div className="divide-y divide-slate-100">
                                {(!milestone.deliverables || milestone.deliverables.length === 0) && (
                                    <div className="p-8 text-center text-slate-500">
                                        <FileCheck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                        <p className="font-medium text-slate-700">No deliverables submitted yet</p>
                                        <p className="text-xs text-slate-400 mt-1">When the vendor submits work, deliverable documents and URLs will appear here for review.</p>
                                    </div>
                                )}
                                {milestone.deliverables?.map(d => (
                                    <div key={d.id} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                                <FileCheck size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{d.fileName}</p>
                                                <p className="text-xs text-slate-500">Uploaded {new Date(d.submittedAt || d.uploadedAt || Date.now()).toLocaleString()}</p>
                                                {d.description && <p className="text-xs text-slate-600 mt-1">{d.description}</p>}
                                                {d.rejectionReason && <p className="text-xs text-red-600 mt-1 font-medium">Rejection Reason: {d.rejectionReason}</p>}
                                            </div>
                                        </div>
                                        <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                                            Download / View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <EscrowTimeline currentStatus={milestone.status} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
