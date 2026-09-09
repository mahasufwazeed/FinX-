"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { milestoneService, MILESTONE_API_DISABLED_MSG } from "@/services/milestone.service";
import { dealService } from "@/services/deal.service";
import { Deal, Milestone, MilestoneStatus } from "@/types";
import { RefreshCw, Search, Plus, Eye, AlertCircle, HardHat } from "lucide-react";
import Link from "next/link";
import { MilestoneStatusBadge } from "@/components/ui/MilestoneStatusBadge";

export default function CorporateMilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [selectedDealId, setSelectedDealId] = useState<string>("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<MilestoneStatus | "ALL">("ALL");

    useEffect(() => {
        // Fetch deals so user can select a deal
        dealService.getDeals().then(setDeals).catch(() => { });
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let data: Milestone[] = [];
            if (selectedDealId === "ALL") {
                data = await milestoneService.getAllMilestones();
            } else {
                data = await milestoneService.getProjectMilestones(selectedDealId);
            }
            setMilestones(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch milestones");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMilestones();
    }, [selectedDealId]);

    const isApiDisabled = error === MILESTONE_API_DISABLED_MSG;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Milestones</h1>
                        <p className="text-sm text-slate-500 mt-1">Track project progress, deliverables, approvals, and payment stages.</p>
                    </div>
                    <Button
                        disabled={true}
                        className="gap-2 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                        title="Milestone creation will be available after the milestone backend API is enabled."
                    >
                        <Plus size={16} /> Create Milestone
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between pb-4 border-b border-slate-100">
                        <div className="flex flex-1 flex-wrap gap-4 items-center">
                            <div className="relative max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    className="pl-10 h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search milestones..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={selectedDealId}
                                onChange={e => setSelectedDealId(e.target.value)}
                            >
                                <option value="ALL">All Deals / Projects</option>
                                {deals.map(d => (
                                    <option key={d.id} value={d.id}>{d.title}</option>
                                ))}
                            </select>
                            <select
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value as any)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="SUBMITTED">Submitted</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchMilestones} disabled={isLoading} className="gap-2 text-slate-600">
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isApiDisabled && (
                            <div className="p-12 text-center flex flex-col items-center bg-slate-50 border-b border-slate-100">
                                <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                    <HardHat size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">Backend Integration Pending</h3>
                                <p className="text-slate-500 mt-2 max-w-md">
                                    {MILESTONE_API_DISABLED_MSG} Check back later once the milestone management APIs are deployed.
                                </p>
                            </div>
                        )}

                        {!isApiDisabled && error && (
                            <div className="p-6 text-center text-red-600 flex flex-col items-center">
                                <AlertCircle className="mb-2" size={24} />
                                <p>{error}</p>
                                <Button variant="outline" className="mt-4" onClick={fetchMilestones}>Try Again</Button>
                            </div>
                        )}

                        {!error && isLoading && (
                            <div className="p-12 text-center text-slate-500 flex flex-col items-center border-t border-slate-100">
                                <RefreshCw size={32} className="animate-spin text-blue-500 mb-4" />
                                <p>Loading milestones...</p>
                            </div>
                        )}

                        {!error && !isLoading && milestones.length === 0 && (
                            <div className="p-12 text-center text-slate-500 border-t border-slate-100">
                                <p>No milestones found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}