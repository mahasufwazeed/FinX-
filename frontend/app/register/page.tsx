"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const registerSchema = z.object({
    fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    role: z.enum(["CORPORATE", "VENDOR", "PROJECT_MANAGER", "FINANCE"], { required_error: "Please select a role" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: registerAction, googleLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: RegisterFormValues) => {
        setError(null);
        try {
            await registerAction({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                role: data.role,
            });
            setSuccess(true);
        } catch (err) {
            // @ts-expect-error type any
            const errorResponse = err.response?.data?.message || err.message || "";
            if (err instanceof TypeError || errorResponse.toLowerCase().includes('network')) {
                setError("Unable to connect to FINX. Please check your connection and try again.");
            } else if (axios.isAxiosError(err) && err.response?.status === 409) {
                setError("This email is already registered. Please sign in.");
            } else {
                setError("Failed to create account. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* LEFT SIDE - Product Introduction */}
            <div className="hidden md:flex md:w-1/2 bg-slate-50 border-r border-slate-200 flex-col justify-between p-12 lg:p-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent pointer-events-none"></div>

                <div>
                    <Link href="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
                        <div className="bg-blue-600 p-1.5 rounded text-white">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">FINX</span>
                    </Link>

                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6 mt-12">
                        Join the secure <br /> network for <br />
                        <span className="text-blue-600">B2B transactions.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-md">
                        Execute projects, verify milestones, and secure fiat escrow payments entirely in one place.
                    </p>
                </div>

                {/* Visual Workflow Steps */}
                <div className="space-y-6 mt-16 pb-12">
                    <div className="flex flex-col gap-3 border-l-2 border-blue-200 pl-6 ml-3">
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white"></div>
                            <p className="font-semibold text-slate-800">1. Select your Role</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-400 ring-4 ring-slate-50"></div>
                            <p className="font-semibold text-slate-800">2. Define or Accept Projects</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-slate-50"></div>
                            <p className="font-semibold text-slate-800 flex items-center gap-2">3. Transact Securely <CheckCircle2 size={16} className="text-indigo-600" /></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Registration Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative h-screen overflow-y-auto">
                <div className="md:hidden mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">FINX</span>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto md:mx-0">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
                        <p className="text-slate-500 mt-2">Join FINX to manage your B2B deals & milestones</p>
                    </div>

                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="p-4 text-green-700 bg-green-50 rounded-md border border-green-200 flex flex-col items-center">
                                <CheckCircle2 size={32} className="text-green-600 mb-3" />
                                <p className="font-medium text-lg">Account created successfully!</p>
                                <p className="text-sm mt-1">We are configuring your dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 flex items-start gap-2">
                                    <div className="mt-0.5">⚠️</div>
                                    <p>{error}</p>
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                {...register("fullName")}
                                error={errors.fullName?.message}
                            />

                            <Input
                                label="Email address"
                                type="email"
                                placeholder="you@company.com"
                                {...register("email")}
                                error={errors.email?.message}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="8+ characters"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Repeat password"
                                    {...register("confirmPassword")}
                                    error={errors.confirmPassword?.message}
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="block text-sm font-medium text-slate-700">Select your Role on FINX</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Custom Radio Cards */}
                                    {[
                                        { id: 'CORPORATE', label: 'Corporate', desc: 'Buyer / Client' },
                                        { id: 'VENDOR', label: 'Vendor', desc: 'Service Provider' },
                                        { id: 'PROJECT_MANAGER', label: 'Proj Manager', desc: 'Approver' },
                                        { id: 'FINANCE', label: 'Finance', desc: 'Billing / Audit' }
                                    ].map((roleOption) => (
                                        <label key={roleOption.id} className={`
                      relative flex cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none 
                      ${selectedRole === roleOption.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'}
                    `}>
                                            <input
                                                type="radio"
                                                value={roleOption.id}
                                                className="sr-only"
                                                {...register("role")}
                                            />
                                            <span className="flex flex-1">
                                                <span className="flex flex-col">
                                                    <span className={`block text-sm font-medium ${selectedRole === roleOption.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                                        {roleOption.label}
                                                    </span>
                                                    <span className={`block text-xs mt-1 ${selectedRole === roleOption.id ? 'text-blue-700' : 'text-slate-500'}`}>
                                                        {roleOption.desc}
                                                    </span>
                                                </span>
                                            </span>
                                            {selectedRole === roleOption.id && (
                                                <CheckCircle2 size={16} className="text-blue-600" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
                            </div>

                            <Button type="submit" className="w-full mt-6" isLoading={isSubmitting} disabled={isSubmitting}>
                                Create Account
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 flex items-center justify-center">
                        <span className="w-full border-t border-slate-200"></span>
                        <span className="bg-white px-3 text-xs text-slate-500 uppercase tracking-wider">Or</span>
                        <span className="w-full border-t border-slate-200"></span>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    if (credentialResponse.credential) {
                                        await googleLogin(credentialResponse.credential);
                                    }
                                } catch (e) {
                                    setError("Google Sign Up failed.");
                                }
                            }}
                            onError={() => setError("Google Sign Up failed.")}
                            useOneTap
                        />
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-slate-500">Already have an account? </span>
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Sign in Instead
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <Link href="/" className="hover:text-slate-800 transition-colors">
                            &larr; Back to Home
                        </Link>
                        <Link href="/contact" className="hover:text-slate-800 transition-colors">
                            Need help?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
