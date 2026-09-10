"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const loginSchema = z.object({
    email: z.string().trim().min(1, { message: "Email is required." }).email({ message: "Enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, googleLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            await login({ email: data.email, password: data.password });
        } catch (err) {
            // @ts-expect-error type any
            const errorResponse = err.response?.data?.message || err.message || "";
            if (err instanceof TypeError || errorResponse.toLowerCase().includes('network')) {
                setError("Unable to connect to FINX. Please check your connection and try again.");
            } else if (errorResponse.toLowerCase().includes('disabled') || errorResponse.toLowerCase().includes('unavailable')) {
                setError("Your account is currently unavailable. Please contact FINX support.");
            } else if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError("Invalid email or password. Please try again.");
            } else {
                setError("Invalid email or password. Please try again.");
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
                        Milestone-Based Payments.<br />
                        <span className="text-blue-600">Built for Business.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-md">
                        Manage projects, track milestones, and coordinate payment workflows with FINX.
                    </p>
                </div>

                {/* Visual Workflow Steps */}
                <div className="space-y-6 mt-16 pb-12">
                    <div className="flex flex-col gap-3 border-l-2 border-blue-200 pl-6 ml-3">
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white"></div>
                            <p className="font-semibold text-slate-800">Project <span className="opacity-50 mx-2">&rarr;</span> Milestones</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-400 ring-4 ring-slate-50"></div>
                            <p className="font-semibold text-slate-800">Payment <span className="opacity-50 mx-2">&rarr;</span> Approval</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-slate-50"></div>
                            <p className="font-semibold text-slate-800 flex items-center gap-2">Release <CheckCircle2 size={16} className="text-indigo-600" /></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Sign In Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative">
                <div className="md:hidden mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">FINX</span>
                    </Link>
                </div>

                <div className="max-w-sm w-full mx-auto md:mx-0">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-slate-500 mt-2">Sign in to your FINX account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 flex items-start gap-2">
                                <div className="mt-0.5">⚠️</div>
                                <p>{error}</p>
                            </div>
                        )}

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="you@company.com"
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                            error={errors.password?.message}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    {...register("rememberMe")}
                                />
                                <span className="text-slate-600">Remember Me</span>
                            </label>

                            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full mt-2" isLoading={isSubmitting} disabled={isSubmitting}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 flex items-center justify-center">
                        <span className="w-full border-t border-slate-200"></span>
                        <span className="bg-white px-3 text-xs text-slate-500 uppercase tracking-wider">Or</span>
                        <span className="w-full border-t border-slate-200"></span>
                    </div>

                    <div className="mt-6">
                        <GoogleSignInButton
                            actionLabel="Sign in with Google"
                            onErrorMessage={(msg) => setError(msg)}
                        />
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-slate-500">Don&apos;t have an account? </span>
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Create Account
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <Link href="/" className="hover:text-slate-800 transition-colors">
                            &larr; Back to Home
                        </Link>
                        <Link href="/contact" className="hover:text-slate-800 transition-colors">
                            Need help signing in?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
