"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { ShieldAlert, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Placeholder for full dispute functionality
export default function BuyerDisputesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Legal Disputes & Arbitration</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage contestations on escrow releases and vendor default.</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                        <ShieldAlert size={16} /> Raise New Dispute
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-16 text-center text-slate-500 flex flex-col items-center">
                        <FileWarning size={48} className="text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No Active Disputes</h3>
                        <p className="mt-2 text-sm max-w-sm">
                            You currently have no contested milestones. The FINX arbitration engine will track all future locked vaults here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
