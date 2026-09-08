"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, UploadCloud, ArrowRight } from "lucide-react";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function VendorDashboard() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const projectId = 'proj-demo-1';

    useEffect(() => {
        milestoneService.getProjectMilestones(projectId)
            .then(setMilestones)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Contracts</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage active deliverables and submit work for PM review.</p>
                </div>

                <Card>
                    <div className="divide-y divide-slate-100">
                        {isLoading && <div className="p-8 text-center text-slate-500">Loading your contracts...</div>}

                        {!isLoading && milestones.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No milestones assigned to you.</div>
                        )}

                        {milestones.map(m => (
                            <div key={m.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-slate-900">{m.title}</h3>
                                        <MilestoneStatusBadge status={m.status} />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{m.description}</p>
                                </div>
                                <div className="flex shrink-0">
                                    <Link href={`/vendor/projects/${projectId}/milestones/${m.id}`}>
                                        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                            Open Workspace <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
