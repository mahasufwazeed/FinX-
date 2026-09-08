import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
                <p className="text-slate-600 bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200">
                    Password reset functionality is not yet available in the MVP foundation. Please contact your FINX Admin.
                </p>
                <div className="pt-4">
                    <Link href="/login" className="text-blue-600 font-medium hover:underline">
                        &larr; Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
