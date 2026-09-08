"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    role: z.enum(["BUYER", "SELLER"], { required_error: "Please select a role" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: registerAction } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

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
            setError(err.response?.data?.message || err.message || "Failed to create account. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                    <p className="text-sm text-slate-500">Join FINX to manage your B2B deals & milestones</p>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
                                Account created successfully! Redirecting...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                {...register("fullName")}
                                error={errors.fullName?.message}
                            />

                            <Input
                                label="Email"
                                placeholder="name@example.com"
                                type="email"
                                {...register("email")}
                                error={errors.email?.message}
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <Input
                                label="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">I am a...</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="BUYER" {...register("role")} className="text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm text-slate-700">Buyer</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="SELLER" {...register("role")} className="text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm text-slate-700">Seller / Service Provider</span>
                                    </label>
                                </div>
                                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
                            </div>

                            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                Create Account
                            </Button>

                            <p className="text-center text-sm text-slate-600 mt-4">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
