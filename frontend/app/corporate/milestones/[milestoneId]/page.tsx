"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { milestoneService, MILESTONE_API_DISABLED_MSG } from "@/services/milestone.service";
import { Milestone } from "@/types";
import { ArrowLeft, HardHat, AlertCircle, RefreshCw } from "lucide-react";

export default function CorporateMilestoneDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const milestoneId = params.milestoneId as string;

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMilestone = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await milestoneService.getMilestone(milestoneId);
            setMilestone(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch milestone details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (milestoneId) {
            fetchMilestone();
        }
    }, [milestoneId]);

    const isApiDisabled = error === MILESTONE_API_DISABLED_MSG;

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-3 text-slate-500 hover:text-slate-900">
                    <ArrowLeft size={16} /> Back to Milestones
                </Button>

                {isApiDisabled ? (
                    <Card className="mt-8 border-dashed border-2 border-slate-200">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-slate-50">
                            <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                <HardHat size={32} />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">Details Unavailable</h2>
                            <p className="text-slate-500 mt-2 max-w-md">
                                {MILESTONE_API_DISABLED_MSG} Check back later to see details and actions for milestone <strong>{milestoneId}</strong>.
                            </p>
                        </CardContent>
                    </Card>
                ) : error ? (
                    <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg flex flex-col items-center">
                        <AlertCircle className="mb-2" size={24} />
                        <p>{error}</p>
                        <Button variant="outline" className="mt-4" onClick={fetchMilestone}>Try Again</Button>
                    </div>
                ) : isLoading ? (
                    <div className="p-24 text-center text-slate-500 flex flex-col items-center">
                        <RefreshCw size={32} className="animate-spin text-blue-500 mb-4" />
                        <p>Loading milestone...</p>
                    </div>
                ) : (
                    <div>{/* Functional Details will render here when API exists */}</div>
                )}
            </div>
        </DashboardLayout>
    );
}
