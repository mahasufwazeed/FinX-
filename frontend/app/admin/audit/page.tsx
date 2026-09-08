"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { useEscrowStore } from "@/store/useEscrowStore";

export default function AuditLogsPage() {
    const { auditLogs } = useEscrowStore();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Immutable record of all platform states, escrow fund movements, and approvals.</p>
                </div>

                <Card>
                    <div className="divide-y divide-slate-100">
                        {auditLogs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No actions have been executed on the platform.</div>
                        ) : (
                            auditLogs.map(log => (
                                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-1">User ID: {log.userId}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <span className="text-xs text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                                        <div className="mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block border border-blue-100">
                                            txn_hash_{log.id.slice(-6)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
