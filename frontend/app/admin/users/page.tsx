"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { adminService } from "@/services/day6.service";
import { UserCheck, UserX } from "lucide-react";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        adminService.getUsers().then(setUsers).finally(() => setIsLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Identity & Access Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Suspend, role-shift, and monitor network entities.</p>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">User Details</th>
                                    <th className="p-4 font-semibold text-slate-600">Access Role</th>
                                    <th className="p-4 font-semibold text-slate-600">System Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Querying database...</td></tr>}
                                {!isLoading && users.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-900">{u.fullName || 'Anonymous'}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </td>
                                        <td className="p-4"><span className="inline-flex bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono text-xs">{u.role}</span></td>
                                        <td className="p-4 flex items-center gap-1 text-emerald-600 font-medium">
                                            <UserCheck size={16} /> ACTIVE
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 bg-red-50 px-3 py-1 rounded">Suspend Identity</button>
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
