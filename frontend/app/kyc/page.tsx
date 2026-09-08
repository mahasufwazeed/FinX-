"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Building2, FileCheck, ShieldCheck, UploadCloud, UserCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState } from "react";

export default function KycPage() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const isCorporate = user?.role === "CORPORATE";

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isCorporate ? "Know Your Business (KYB)" : "Identity Verification (KYC)"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Financial compliance requires us to verify your {isCorporate ? "corporate entity" : "identity"} before initiating fiat escrow.
                    </p>
                </div>

                <div className="flex gap-4 mb-8">
                    <div className="flex-1 border-b-2 border-blue-600 pb-2">
                        <span className="text-blue-600 font-bold text-sm block">Step 1</span>
                        <span className="text-slate-900 font-medium">{isCorporate ? 'Company Details' : 'Personal Details'}</span>
                    </div>
                    <div className={`flex-1 border-b-2 pb-2 ${step > 1 ? 'border-blue-600' : 'border-slate-200'}`}>
                        <span className={`font-bold text-sm block ${step > 1 ? 'text-blue-600' : 'text-slate-400'}`}>Step 2</span>
                        <span className={`font-medium ${step > 1 ? 'text-slate-900' : 'text-slate-500'}`}>Document Upload</span>
                    </div>
                    <div className={`flex-1 border-b-2 pb-2 ${step > 2 ? 'border-blue-600' : 'border-slate-200'}`}>
                        <span className={`font-bold text-sm block ${step > 2 ? 'text-blue-600' : 'text-slate-400'}`}>Step 3</span>
                        <span className={`font-medium ${step > 2 ? 'text-slate-900' : 'text-slate-500'}`}>Verification</span>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-8">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                        {isCorporate ? <Building2 size={24} /> : <UserCircle size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Entity Information</h3>
                                        <p className="text-sm text-slate-500">Please provide exactly as it appears on your legal documents.</p>
                                    </div>
                                </div>

                                {isCorporate ? (
                                    <>
                                        <Input label="Legal Business Name" placeholder="Acme Corporation Ltd." />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Registration Number (EIN / CRN)" placeholder="XX-XXXXXXX" />
                                            <Input label="Jurisdiction / State of Incorporation" placeholder="Delaware, US" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Input label="Full Legal Name" placeholder="Johnathan Doe" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Date of Birth" type="date" />
                                            <Input label="Government ID Number" placeholder="Passport or SSN" />
                                        </div>
                                    </>
                                )}

                                <Input label="Registered Address" placeholder="123 Financial District, Suite 400" />

                                <div className="pt-4 flex justify-end">
                                    <Button onClick={() => setStep(2)}>Continue to Documents &rarr;</Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                        <FileCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Document Uploads</h3>
                                        <p className="text-sm text-slate-500">Secure AES-256 encrypted storage for compliance review.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-500 cursor-pointer transition-colors">
                                        <UploadCloud size={32} className="text-slate-400 mb-3" />
                                        <p className="font-semibold text-slate-700">{isCorporate ? 'Certificate of Incorporation' : 'Government Issued ID'}</p>
                                        <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                                    </div>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-500 cursor-pointer transition-colors">
                                        <UploadCloud size={32} className="text-slate-400 mb-3" />
                                        <p className="font-semibold text-slate-700">Proof of Address</p>
                                        <p className="text-xs text-slate-500 mt-1">Utility bill or Bank Statement &lt; 90 days</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                    <Button onClick={() => setStep(3)}>Submit for Review &rarr;</Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="py-12 flex flex-col items-center text-center space-y-4">
                                <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={40} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Under Review</h2>
                                <p className="text-slate-600 max-w-md">
                                    Your compliance packet has been securely transmitted. Our automated FINX compliance engine paired with human auditors usually completes verification within **1 to 4 hours**.
                                </p>
                                <Button className="mt-4" onClick={() => setStep(1)} variant="outline">Back to Dashboard</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
