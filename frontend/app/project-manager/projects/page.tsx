"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Wrench } from "lucide-react";

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">projects</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your projects</p>
                </div>
                
                <Card className="mt-8 border-dashed border-2 border-slate-200">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                            <Wrench size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">Under Construction</h2>
                        <p className="text-slate-500 mt-2 max-w-sm">
                            The projects module is currently being developed and will be available in the upcoming release.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}