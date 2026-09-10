"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { milestoneService } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";
import { ListTodo, CheckSquare, XCircle, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function ProjectManagerReviewsPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        milestoneService.getAllMilestones()
            .then(setMilestones)
            .catch(() => setMilestones([]))
            .finally(() => setIsLoading(false));
    }, []);

    const reviewItems = milestones.filter(m =>
        m.status === "UNDER_REVIEW" ||
        m.status === "IN_PROGRESS" ||
        m.status === "APPROVED" ||
        m.status === "REJECTED"
    );

    const filtered = reviewItems.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingReviewCount = milestones.filter(m => m.status === "UNDER_REVIEW").length;
    const approvedCount = milestones.filter(m => m.status === "APPROVED").length;
    const rejectedCount = milestones.filter(m => m.status === "REJECTED").length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Milestone Review Queue</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit submitted vendor deliverables, review specification compliance, and approve escrow disbursements.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Pending Deliverable Review</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-2">{pendingReviewCount}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Approved Milestones</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">{approvedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <CheckSquare size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Rejected Revisions</p>
                                    <p className="text-3xl font-bold text-rose-600 mt-2">{rejectedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-rose-50 flex items-center justify-center rounded-full text-rose-600">
                                    <XCircle size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by milestone title or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="ALL">All Review Statuses</option>
                                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Milestone</th>
                                    <th className="p-4 font-semibold text-slate-600">Deal Reference</th>
                                    <th className="p-4 font-semibold text-slate-600">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Review Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Due Date</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            Loading review queue...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No milestone reviews matching your criteria.
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-900">{m.title}</p>
                                            {m.description && (
                                                <p className="text-xs text-slate-500 truncate max-w-xs">{m.description}</p>
                                            )}
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
                                            {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/corporate/milestones/${m.id}`}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Audit Milestone →
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