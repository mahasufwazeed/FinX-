"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { dealService } from "@/services/deal.service";
import { Deal } from "@/types";
import { HardHat, Upload, FileText, AlertCircle, RefreshCw } from "lucide-react";

export default function VendorDeliverablesPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [selectedDealId, setSelectedDealId] = useState<string>("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeals = async () => {
        setIsLoading(true);
        try {
            const data = await dealService.getDeals();
            setDeals(data);
            if (data.length > 0) {
                setSelectedDealId(data[0].id);
            }
        } catch (e: any) {
            setError(e.message || "Failed to load assigned deals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmitDeliverable = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Deliverable upload APIs are currently disabled on the backend. This submission will be enabled once the milestone delivery endpoints are deployed.");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Submit Deliverables</h1>
                        <p className="text-sm text-slate-500 mt-1">Upload files and submit milestone deliverables for corporate review.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchDeals} disabled={isLoading} className="gap-2">
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
                    </Button>
                </div>

                {/* API Status Notice */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <HardHat size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-900">Milestone Deliverable API Pending Backend Integration</h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                            File storage and deliverable verification endpoints (<code>POST /api/milestones/&#123;id&#125;/deliverables</code>) are scheduled for the next release. Real file inputs and submission forms are ready for backend wiring.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} />
                        <p>{error}</p>
                    </div>
                )}

                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <Upload size={18} className="text-blue-600" />
                            New Deliverable Submission
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Target Project / Deal *</label>
                                {deals.length > 0 ? (
                                    <select
                                        value={selectedDealId}
                                        onChange={e => setSelectedDealId(e.target.value)}
                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {deals.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.title} (${d.totalAmount?.toLocaleString()} {d.currency} - {d.status})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-slate-500 p-2 bg-slate-50 rounded border border-slate-200">
                                        No active deals found. You must be assigned to a deal before submitting deliverables.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deliverable File *</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {selectedFile && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description & Notes *</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Provide completion details, test reports, or pull request links for the corporate client..."
                                />
                            </div>

                            <Button type="submit" disabled={deals.length === 0} className="w-full sm:w-auto gap-2">
                                <FileText size={16} /> Submit Deliverable for Review
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}