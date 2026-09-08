"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import { Milestone } from "@/types";
import { milestoneService } from "@/services/milestone.service";
import Link from "next/link";
import { ArrowLeft, CheckSquare, XCircle, FileCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProjectManagerReviewDetail() {
    const { milestoneId } = useParams();
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [comments, setComments] = useState("");

    useEffect(() => {
        fetchData();
    }, [milestoneId]);

    const fetchData = () => {
        if (milestoneId) {
            milestoneService.getMilestone(milestoneId as string).then(setMilestone);
        }
    }

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            await milestoneService.approveMilestone(milestoneId as string);
            alert('Milestone APPROVED! FinX Admin will be notified to execute escrow transfer.');
            await fetchData();
        } finally { setIsApproving(false); }
    }

    const handleReject = async () => {
        if (!comments.trim()) {
            alert("You must provide feedback comments explaining why it was rejected.");
            return;
        }
        setIsRejecting(true);
        try {
            await milestoneService.rejectMilestone(milestoneId as string, comments);
            alert('Milestone REJECTED! Vendor must rework and resubmit.');
            await fetchData();
        } finally { setIsRejecting(false); }
    }

    if (!milestone) return <DashboardLayout><div className="p-8">Loading review details...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <Link href="/project-manager" className="text-sm text-blue-600 flex items-center gap-1 mb-4 hover:underline">
                        <ArrowLeft size={16} /> Back to Review Queue
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Review: {milestone.title}</h1>
                            <p className="text-sm text-slate-500 mt-1">Value: ${milestone.amount.toLocaleString()} {milestone.currency}</p>
                        </div>
                        <MilestoneStatusBadge status={milestone.status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Deliverables Check</h3>
                            <div className="divide-y divide-slate-100 border rounded-lg">
                                {(!milestone.deliverables || milestone.deliverables.length === 0) && (
                                    <div className="p-4 text-sm text-slate-500">No deliverables uploaded.</div>
                                )}
                                {milestone.deliverables?.map(d => (
                                    <div key={d.id} className="p-4 flex items-center justify-between bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <FileCheck size={18} className="text-indigo-600" />
                                            <span className="font-medium text-sm text-slate-900">{d.fileName}</span>
                                        </div>
                                        <a href={d.fileUrl} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">Verify</a>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <MessageSquare size={18} /> Official Arbitration
                            </h3>

                            {milestone.status === 'UNDER_REVIEW' ? (
                                <>
                                    <textarea
                                        className="w-full h-32 border border-slate-300 rounded-md p-3 text-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Enter inspection notes, comments, or rejection feedback here..."
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                    />
                                    <div className="flex gap-3">
                                        <Button onClick={handleReject} isLoading={isRejecting} variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                                            <XCircle size={16} className="mr-2" /> Reject Deliverables
                                        </Button>
                                        <Button onClick={handleApprove} isLoading={isApproving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                            <CheckSquare size={16} className="mr-2" /> Officially Approve
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                                    <CheckSquare className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                    <p className="text-slate-600 text-sm">
                                        This milestone is currently <strong>{milestone.status.replace('_', ' ')}</strong>. No further PM review actions are available.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
