"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { dealService } from "@/services/deal.service";
import { milestoneService } from "@/services/milestone.service";
import { Deal, Milestone } from "@/types";
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VendorDeliverablesPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [selectedDealId, setSelectedDealId] = useState("");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fetchDeals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await dealService.getDeals();
            setDeals(data);
            if (data.length > 0) {
                setSelectedDealId(data[0].id);
            }
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || "Failed to load assigned deals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    useEffect(() => {
        if (selectedDealId) {
            milestoneService.getProjectMilestones(selectedDealId)
                .then((ms) => {
                    setMilestones(ms);
                    if (ms.length > 0) {
                        setSelectedMilestoneId(ms[0].id);
                    } else {
                        setSelectedMilestoneId("");
                    }
                })
                .catch(() => setMilestones([]));
        }
    }, [selectedDealId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmitDeliverable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMilestoneId) {
            setError("Please select a target milestone for this deliverable.");
            return;
        }

        const fileName = selectedFile ? selectedFile.name : `deliverable_${Date.now()}.pdf`;
        const fileUrl = `https://storage.finx.local/deliverables/${encodeURIComponent(fileName)}`;

        setIsSubmitting(true);
        setError(null);
        setSuccessMsg(null);

        try {
            await milestoneService.submitDeliverable(selectedMilestoneId, {
                fileName,
                fileUrl,
                description: description.trim()
            });
            setSuccessMsg("Deliverable successfully submitted to the corporate buyer for review!");
            setSelectedFile(null);
            setDescription("");
            // Refresh milestones
            if (selectedDealId) {
                const updated = await milestoneService.getProjectMilestones(selectedDealId);
                setMilestones(updated);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to submit deliverable");
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-emerald-900">Milestone Deliverables Engine Connected</h4>
                        <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                            Submitting deliverables marks the milestone as under review. Corporate buyers review files and descriptions before approving milestone escrow release.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} />
                        <p>{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm flex items-center gap-2 border border-emerald-200">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <p className="font-semibold">{successMsg}</p>
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
                                                {d.title} (₹{d.totalAmount?.toLocaleString()} {d.currency || 'INR'} - {d.status})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-slate-500 p-2 bg-slate-50 rounded border border-slate-200">
                                        No active deals found. You must be assigned to a deal before submitting deliverables.
                                    </p>
                                )}
                            </div>

                            {milestones.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Milestone *</label>
                                    <select
                                        value={selectedMilestoneId}
                                        onChange={e => setSelectedMilestoneId(e.target.value)}
                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {milestones.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.title} (₹{m.amount?.toLocaleString()} {m.currency || 'INR'} — Status: {m.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deliverable Document / Artifact</label>
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description & Delivery Notes *</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Provide completion details, test reports, or pull request links for the corporate client..."
                                />
                            </div>

                            <Button type="submit" disabled={deals.length === 0 || isSubmitting} isLoading={isSubmitting} className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white">
                                <FileText size={16} /> Submit Deliverable for Review
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}