"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { milestoneService } from "@/services/milestone.service";
import { paymentService } from "@/services/payment.service";
import { loadRazorpay } from "@/lib/razorpay";
import { Milestone, Payment } from "@/types";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Wallet, ShieldCheck, AlertCircle } from "lucide-react";

export default function FundMilestoneCheckout() {
    const { projectId, milestoneId } = useParams();
    const router = useRouter();

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [activePayment, setActivePayment] = useState<Payment | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentState, setPaymentState] = useState<string>("INITIAL"); // INITIAL, CREATING_ORDER, CHECKOUT_OPEN, VERIFYING, SUCCESS, FAILED
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        milestoneService.getMilestone(milestoneId as string).then(setMilestone);
        // Ideally we would fetch the exact active payment here if resuming
    }, [milestoneId]);

    const handleFundClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmAndPay = async () => {
        try {
            setIsModalOpen(false);
            setPaymentState("CREATING_ORDER");
            setIsProcessing(true);

            const scriptLoaded = await loadRazorpay();
            if (!scriptLoaded) {
                alert("Payment gateway failed to load. Please check your network.");
                setPaymentState("FAILED");
                setIsProcessing(false);
                return;
            }

            // 1. Create order on backend
            const order = await paymentService.createPaymentOrder(projectId as string, milestoneId as string);

            setPaymentState("CHECKOUT_OPEN");

            // 2. Open Razorpay Checkout options
            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "FINX Escrow Protocol",
                description: `Milestone Funding: ${milestone?.title}`,
                order_id: order.orderId,
                handler: async function (response: any) {
                    setPaymentState("VERIFYING");

                    try {
                        // 3. Send securely to backend to execute cryptographic verification signature
                        await paymentService.verifyPayment({
                            paymentId: order.paymentId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        setPaymentState("SUCCESS");

                        // Refresh milestone globally
                        milestoneService.getMilestone(milestoneId as string).then(setMilestone);
                    } catch (err) {
                        setPaymentState("FAILED");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        if (paymentState !== "VERIFYING" && paymentState !== "SUCCESS") {
                            setPaymentState("CANCELLED");
                            setIsProcessing(false);
                        }
                    }
                },
                prefill: {
                    name: "Corporate Buyer",
                    email: "buyer@finx.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#0f172a" // Slate-900 FINX theme
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                setPaymentState("FAILED");
                setIsProcessing(false);
            });

            razorpay.open();

        } catch (err) {
            setPaymentState("FAILED");
            setIsProcessing(false);
            alert("Failed to initialize payment. " + (err as any).message);
        }
    };

    if (!milestone) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <Link href={`/corporate/projects/${projectId}/payments`} className="text-sm text-blue-600 flex items-center gap-1 mb-4 hover:underline">
                        <ArrowLeft size={16} /> Back to Project Schedule
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Secure Vault Deposit</h1>
                            <p className="text-sm text-slate-500 mt-1">Fund milestone to legally bind the vendor contract.</p>
                        </div>
                    </div>
                </div>

                {paymentState === "SUCCESS" && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md flex items-center gap-3 text-emerald-800">
                        <ShieldCheck size={24} />
                        <div>
                            <p className="font-semibold text-emerald-900">Payment successful</p>
                            <p className="text-sm">The milestone is now fully funded into escrow. The vendor will be notified to begin work.</p>
                        </div>
                    </div>
                )}

                {paymentState === "FAILED" && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-center gap-3 text-red-800">
                        <AlertCircle size={24} />
                        <div>
                            <p className="font-semibold text-red-900">Payment failed or was dropped.</p>
                            <p className="text-sm">No funds were captured. Please try again.</p>
                        </div>
                    </div>
                )}

                {paymentState === "VERIFYING" && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-md flex items-center gap-3 text-blue-800 animate-pulse">
                        <ShieldCheck size={24} />
                        <div>
                            <p className="font-semibold text-blue-900">Payment submitted for verification...</p>
                            <p className="text-sm">Validating cryptographic signatures with your bank network.</p>
                        </div>
                    </div>
                )}

                <Card>
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start pb-6 border-b border-slate-200 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{milestone.title}</h2>
                                <p className="text-slate-600 mt-2 max-w-xl">{milestone.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-700">
                                <span>Milestone Value</span>
                                <span className="font-medium">${milestone.amount.toLocaleString()} {milestone.currency}</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>FINX Platform Escrow Fee (0.00%)</span>
                                <span className="font-medium">$0</span>
                            </div>
                            <div className="flex justify-between text-slate-900 font-bold text-lg pt-4 border-t border-slate-200">
                                <span>Total Payable Securely</span>
                                <span>${milestone.amount.toLocaleString()} {milestone.currency}</span>
                            </div>
                        </div>

                        {milestone.status === 'PENDING' ? (
                            <Button
                                onClick={handleFundClick}
                                isLoading={isProcessing && paymentState !== "CHECKOUT_OPEN"}
                                className="w-full h-12 text-lg gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Wallet size={20} />
                                {isProcessing ? "Processing..." : "Fund Secure Escrow"}
                            </Button>
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
                                <p className="text-slate-600 font-medium">This milestone has already been funded.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Custom Confirmation Modal Triggered by the Button */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Confirm Funding</h3>
                                <p className="text-slate-600 mb-4">
                                    You are about to securely deposit <strong>${milestone.amount.toLocaleString()} {milestone.currency}</strong> into the FINX Escrow Vault.
                                </p>
                                <ul className="text-sm text-slate-500 space-y-2 mb-6 list-disc pl-5">
                                    <li>Funds are held securely by FINX.</li>
                                    <li>Vendor cannot access funds until you/PM approve deliverables.</li>
                                    <li>100% refundable if the Vendor defaults on the contract.</li>
                                </ul>
                                <div className="flex gap-3">
                                    <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
                                    <Button onClick={handleConfirmAndPay} className="flex-1 bg-slate-900 text-white">Confirm and Pay</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
