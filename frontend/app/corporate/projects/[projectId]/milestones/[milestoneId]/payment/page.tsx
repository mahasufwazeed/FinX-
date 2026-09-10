"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { milestoneService } from "@/services/milestone.service";
import { paymentService, PAYMENT_API_DISABLED_MSG } from "@/services/payment.service";
import { Milestone } from "@/types";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Wallet, ShieldCheck, AlertCircle, HardHat } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function FundMilestoneCheckout() {
    const { projectId, milestoneId } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [milestone, setMilestone] = useState<Milestone | null>(null);

    useEffect(() => {
        milestoneService.getMilestone(milestoneId as string)
            .then(setMilestone)
            .catch(() => { });
    }, [milestoneId]);

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-3 text-slate-500 hover:text-slate-900">
                    <ArrowLeft size={16} /> Back to Project
                </Button>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Milestone Escrow Funding</h1>
                    <p className="text-sm text-slate-500 mt-1">Lock fiat funds into FINX escrow for milestone completion.</p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <HardHat size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-900">Payment Gateway Integration Pending</h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                            {PAYMENT_API_DISABLED_MSG} Direct deposit creation (<code>POST /api/payments/orders</code> and <code>POST /api/payments/verify</code>) will become active once Razorpay server credentials and Spring Boot payment controllers are enabled.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="font-semibold text-slate-900">{milestone?.title || `Milestone ${milestoneId}`}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Project: {projectId}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-slate-900">
                                    ${milestone?.amount?.toLocaleString() || "0"}
                                </span>
                                <span className="text-xs text-slate-500 ml-1">{milestone?.currency || "USD"}</span>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex justify-between">
                                <span>Corporate Account</span>
                                <span className="font-medium text-slate-900">{user?.name || user?.fullName || "Buyer"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Escrow Fee (0%)</span>
                                <span className="font-medium text-slate-900">$0.00</span>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-900 pt-3 border-t border-slate-100">
                                <span>Total Due</span>
                                <span>${milestone?.amount?.toLocaleString() || "0"} {milestone?.currency || "USD"}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                disabled
                                className="w-full gap-2 cursor-not-allowed bg-slate-300 text-slate-500"
                                title="Funding actions are disabled until the payment API is connected."
                            >
                                <Wallet size={16} /> Pay & Fund Escrow (Gateway Pending)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
