"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { dealService } from "@/services/deal.service";
import { Deal } from "@/types";
import { Briefcase, CheckCircle, Clock, AlertTriangle, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        dealService.getDeals()
            .then(setDeals)
            .catch(() => setDeals([]))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredDeals = deals.filter(deal => {
        const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || deal.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const activeCount = deals.filter(d => d.status === "ACTIVE").length;
    const completedCount = deals.filter(d => d.status === "COMPLETED").length;
    const totalVolume = deals.reduce((acc, d) => acc + (Number(d.totalAmount) || 0), 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "COMPLETED":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "PENDING_ACCEPTANCE":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "DISPUTED":
                return "bg-red-50 text-red-700 border-red-200";
            case "CANCELLED":
                return "bg-slate-100 text-slate-600 border-slate-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Deals & Projects</h1>
                    <p className="text-sm text-slate-500 mt-1">Global directory of B2B fiat escrow deals across all buyers and vendors.</p>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Deals</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">{deals.length}</p>
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
                                    <p className="text-sm font-medium text-slate-500">Active Deals</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-2">{activeCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Completed Deals</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{completedCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Committed Volume</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-2">
                                        ₹{totalVolume.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-purple-50 flex items-center justify-center rounded-full text-purple-600">
                                    <AlertTriangle size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by deal title or ID..."
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
                                    <option value="ALL">All Statuses</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="PENDING_ACCEPTANCE">PENDING_ACCEPTANCE</option>
                                    <option value="DRAFT">DRAFT</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                    <option value="DISPUTED">DISPUTED</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Deals Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Deal Title</th>
                                    <th className="p-4 font-semibold text-slate-600">Deal ID</th>
                                    <th className="p-4 font-semibold text-slate-600">Total Amount</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Created At</th>
                                    <th className="p-4 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            Loading system deals...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filteredDeals.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No deals match the selected criteria.
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filteredDeals.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">
                                            {deal.title}
                                            {deal.description && (
                                                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{deal.description}</p>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500">
                                            {deal.id}
                                        </td>
                                        <td className="p-4 font-semibold text-slate-900">
                                            {deal.currency} {Number(deal.totalAmount).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold border ${getStatusBadge(deal.status)}`}>
                                                {deal.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/corporate/projects/${deal.id}`}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Deal →
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