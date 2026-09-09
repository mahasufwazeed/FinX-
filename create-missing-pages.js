const fs = require('fs');
const path = require('path');

const roles = {
    corporate: ['projects', 'milestones', 'settings'],
    vendor: ['projects', 'milestones', 'deliverables', 'payments', 'settings'],
    admin: ['projects', 'disputes', 'settings', 'escrow', 'audit'],
    finance: ['payments', 'invoices', 'transactions', 'reports', 'settings'],
    'project-manager': ['projects', 'reviews', 'deliverables', 'reports', 'settings']
};

const baseDir = path.join(__dirname, 'frontend', 'app');

const getTemplate = (role, section) => `
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Wrench } from "lucide-react";

export default function ${section.charAt(0).toUpperCase() + section.slice(1)}Page() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">${section.replace('-', ' ')}</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your ${section.replace('-', ' ')}</p>
                </div>
                
                <Card className="mt-8 border-dashed border-2 border-slate-200">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                            <Wrench size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">Under Construction</h2>
                        <p className="text-slate-500 mt-2 max-w-sm">
                            The ${section.replace('-', ' ')} module is currently being developed and will be available in the upcoming release.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
`;

for (const [role, sections] of Object.entries(roles)) {
    for (const section of sections) {
        const dirPath = path.join(baseDir, role, section);
        const filePath = path.join(dirPath, 'page.tsx');
        if (!fs.existsSync(filePath)) {
            // Create dir
            fs.mkdirSync(dirPath, { recursive: true });
            // Write file
            fs.writeFileSync(filePath, getTemplate(role, section).trim());
            console.log(`Created ${filePath}`);
        } else {
            console.log(`Skipped ${filePath} (already exists)`);
        }
    }
}
