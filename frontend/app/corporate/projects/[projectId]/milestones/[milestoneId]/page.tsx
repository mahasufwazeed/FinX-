"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import { Milestone } from "@/types";
import { milestoneService } from "@/services/milestone.service";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, FileCheck } from "lucide-react";

export default function CorporateMilestoneDetails() {
    const { milestoneId } = useParams();
    const [milestone, setMilestone] = useState<Milestone | null>(null);

    useEffect(() => {
        if (milestoneId) {
            milestoneService.getMilestone(milestoneId as string).then(setMilestone);
        }
    }, [milestoneId]);

    if (!milestone) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <Link href="/corporate" className="text-sm text-blue-600 flex items-center gap-1 mb-4 hover:underline">
                        <ArrowLeft size={16} /> Back to Valid Projects
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{milestone.title}</h1>
                            <p className="text-sm text-slate-500 mt-1">{milestone.description}</p>
                        </div>
                        <MilestoneStatusBadge status={milestone.status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Milestone Value</p>
                                <p className="font-semibold text-lg">${milestone.amount.toLocaleString()} {milestone.currency}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-full">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Last Updated</p>
                                <p className="font-semibold">{new Date(milestone.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Vendor Deliverables</h2>
                <Card>
                    <div className="divide-y divide-slate-100">
                        {(!milestone.deliverables || milestone.deliverables.length === 0) && (
                            <div className="p-6 text-center text-slate-500">
                                <FileCheck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p>No deliverables have been submitted by the vendor yet.</p>
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
                                        <p className="text-xs text-slate-500">Uploaded {new Date(d.uploadedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <a href={d.fileUrl} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">
                                    Download / View
                                </a>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
