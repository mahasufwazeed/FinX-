"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import { FileText, CheckCircle2, Clock, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProjectManagerDeliverablesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .catch(() => setMilestones([]))
            .finally(() => setIsLoading(false));
    }, []);

    const submittedMilestones = milestones.filter(m =>
        m.status === "UNDER_REVIEW" ||
        m.status === "APPROVED" ||
        m.status === "RELEASED" ||
        (m.status as string) === "COMPLETED"
    );

    const filtered = submittedMilestones.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const approvedCount = milestones.filter(m => m.status === "APPROVED" || m.status === "RELEASED").length;
    const underReviewCount = milestones.filter(m => m.status === "UNDER_REVIEW").length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Deliverables Registry</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit artifact submissions, code repositories, and work proof uploaded by vendors.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Deliverables Submitted</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{submittedMilestones.length}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Approved & Verified</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">{approvedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Awaiting Approval</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-2">{underReviewCount}</p>
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
                                placeholder="Search by milestone or deliverable..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Deliverables Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Deliverable / Milestone</th>
                                    <th className="p-4 font-semibold text-slate-600">Deal Reference</th>
                                    <th className="p-4 font-semibold text-slate-600">Escrow Value</th>
                                    <th className="p-4 font-semibold text-slate-600">Audit Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Submission Date</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            Scanning deliverable artifacts...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No deliverables found matching your search.
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-900">{m.title}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-xs">{m.description || "Vendor submission"}</p>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500">
                                            {m.dealId ? m.dealId.slice(0, 8) + '...' : '—'}
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">
                                            ₹{Number(m.amount).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <MilestoneStatusBadge status={m.status} />
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/corporate/milestones/${m.id}`}
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Inspect Artifact <ExternalLink size={12} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}