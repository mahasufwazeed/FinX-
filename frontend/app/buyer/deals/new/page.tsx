"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEscrowStore } from "@/store/useEscrowStore";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function NewDealPage() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const { addDeal, addMilestone } = useEscrowStore();
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const dealId = `deal_${Date.now()}`;
        const totalAmount = parseFloat(amount);

        addDeal({
            id: dealId,
            title,
            status: 'ACTIVE',
            amount: totalAmount
        }, user.id);

        // Auto-create first milestone for simplicity
        addMilestone({
            id: `ms_${Date.now()}`,
            dealId,
            description: description || 'Initial Phase',
            amount: totalAmount,
            status: 'PENDING'
        }, user.id);

        router.push("/buyer/deals");
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Deal</h1>
                    <p className="text-sm text-slate-500 mt-1">Setup the terms and initial milestone for your seller project.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Deal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Deal Title"
                                placeholder="e.g. Acme App Development"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <Input
                                label="Total Deal Amount (USD)"
                                type="number"
                                placeholder="e.g. 5000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">First Milestone Description</label>
                                <textarea
                                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Describe the deliverables required for this milestone..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit">Deploy Deal Contract</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
