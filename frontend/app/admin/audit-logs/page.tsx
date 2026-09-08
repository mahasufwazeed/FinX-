"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { adminService } from "@/services/day6.service";
import { ShieldCheck, ServerCrash } from "lucide-react";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        adminService.getAuditLogs()
            .then(setLogs)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Immutable Audit Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Read-only global systemic trail logic. Required for SEC / Banking audits.</p>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Timestamp</th>
                                    <th className="p-4 font-semibold text-slate-600">Actor Node</th>
                                    <th className="p-4 font-semibold text-slate-600">System Action</th>
                                    <th className="p-4 font-semibold text-slate-600">Entity Affected</th>
                                    <th className="p-4 font-semibold text-slate-600">Response Integrity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Decrypting system logs...</td></tr>}
                                {!isLoading && logs.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No logs found on system partition.</td></tr>
                                )}
                                {!isLoading && logs.map((l: any) => (
                                    <tr key={l.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                        <td className="p-4 font-mono text-xs text-slate-500">{new Date(l.timestamp).toLocaleString()}</td>
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-900">{l.actorName}</p>
                                            <p className="text-xs text-slate-500">Role: {l.actorRole}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800 border border-slate-200 ring-0">
                                                {l.action}
                                            </span>
                                            <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{l.description}</p>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600 border-l border-slate-100">
                                            [{l.entityType}]<br />
                                            {l.entityId}
                                        </td>
                                        <td className="p-4">
                                            {l.result === 'SUCCESS' ? (
                                                <span className="flex items-center text-emerald-600 font-semibold text-xs"><ShieldCheck size={14} className="mr-1" /> IMMUTABLE</span>
                                            ) : (
                                                <span className="flex items-center text-red-600 font-semibold text-xs"><ServerCrash size={14} className="mr-1" /> FAILED</span>
                                            )}
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
