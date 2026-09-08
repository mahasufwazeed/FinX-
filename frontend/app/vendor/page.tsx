"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, CheckCircle, RefreshCcw, DollarSign, UploadCloud } from "lucide-react";
import { useEscrowStore } from "@/store/useEscrowStore";

export default function VendorDashboard() {
    const { milestones, deliverables, submitDeliverable } = useEscrowStore();

    // Vendor sees FUNDED milestones as ready to work on.
    const fundedMilestones = milestones.filter(m => m.status === 'FUNDED');
    const reviewMilestones = milestones.filter(m => m.status === 'REVIEW');
    const approvedMilestones = milestones.filter(m => m.status === 'APPROVED');
    const releasedMilestones = milestones.filter(m => m.status === 'RELEASED');

    const handleUploadDeliverable = (milestoneId: string) => {
        submitDeliverable({
            milestoneId,
            details: 'Uploaded prototype payload zip to S3',
        });
        alert('Deliverable successfully submitted to PM for review!');
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Operations</h1>
                    <p className="text-sm text-slate-500 mt-1">Submit deliverables for funded milestones to trigger payment review.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Ready to Start</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{fundedMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <Briefcase size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">In PM Review</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{reviewMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-600">
                                    <RefreshCcw size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Awaiting Payout</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{approvedMilestones.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Milestones Guaranteed by Escrow (Work Required)</h2>
                <Card className="border-blue-200">
                    <div className="divide-y divide-slate-100">
                        {fundedMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No funded milestones to work on.</div>
                        )}
                        {fundedMilestones.map((m) => (
                            <div key={m.id} className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{m.description}</p>
                                    <p className="text-xs text-green-600 font-medium">Escrow Locked: ${m.amount.toLocaleString()}</p>
                                </div>
                                <Button onClick={() => handleUploadDeliverable(m.id)} className="gap-2">
                                    <UploadCloud size={16} /> Submit Deliverable
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Under Review by PM</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        {reviewMilestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No deliverables currently under review.</div>
                        )}
                        {reviewMilestones.map((m) => (
                            <div key={m.id} className="p-4 flex items-center justify-between bg-slate-50">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{m.description}</p>
                                    <p className="text-xs text-slate-500">Submitted to PM for review.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
