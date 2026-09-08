"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Activity, CheckSquare, ListTodo, XCircle } from "lucide-react";
import { useEscrowStore } from "@/store/useEscrowStore";

export default function ProjectManagerDashboard() {
    const { milestones, approveMilestone, rejectDeliverable, deliverables } = useEscrowStore();

    const reviewMilestones = milestones.filter(m => m.status === 'REVIEW');
    const approvedMilestones = milestones.filter(m => m.status === 'APPROVED');

    const handleApprove = (milestoneId: string) => {
        approveMilestone(milestoneId);
        alert('Milestone approved! Notifying FINX Admin to trigger Escrow Payout.');
    };

    const handleReject = (milestoneId: string) => {
        const deliverable = deliverables.find(d => d.milestoneId === milestoneId && d.status === 'SUBMITTED');
        if (deliverable) {
            rejectDeliverable(deliverable.id);
            alert('Deliverable rejected. Vendor notified to resubmit changes.');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Manager Operations</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit vendor deliverables and sign-off on milestones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Requires PM Review</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{reviewMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <ListTodo size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Approved by You</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{approvedMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CheckSquare size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestones Awaiting Action</h2>
                <Card className="border-amber-200">
                    <div className="divide-y divide-slate-100">
                        {reviewMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">Inbox zero! No milestones awaiting review.</div>
                        )}
                        {reviewMilestones.map((m) => {
                            const deliverableRecord = deliverables.find(d => d.milestoneId === m.id && d.status === 'SUBMITTED');
                            return (
                                <div key={m.id} className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{m.description}</p>
                                        <p className="text-xs text-slate-600 mt-1">Proof: <a href="#" className="text-blue-600 underline">{deliverableRecord?.details || 'ZIP Archive'}</a></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleReject(m.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                                            <XCircle size={16} className="mr-2" /> Reject
                                        </Button>
                                        <Button onClick={() => handleApprove(m.id)} className="bg-emerald-600 hover:bg-emerald-700">
                                            <CheckSquare size={16} className="mr-2" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
