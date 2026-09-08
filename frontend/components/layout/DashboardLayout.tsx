"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users, Briefcase, CreditCard, ShieldCheck,
    Settings, LogOut, Menu, Bell, X
} from "lucide-react";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getNavLinks = () => {
        const baseLinks = [
            { name: "Settings", href: "/settings", icon: Settings },
        ];

        if (user?.role === "ADMIN") {
            return [
                { name: "Overview", href: "/admin", icon: ShieldCheck },
                { name: "All Deals", href: "/admin/deals", icon: Briefcase },
                { name: "Users", href: "/admin/users", icon: Users },
                { name: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
                ...baseLinks
            ];
        }

        if (user?.role === "SELLER") {
            return [
                { name: "Overview", href: "/seller", icon: Briefcase },
                { name: "My Deals", href: "/seller/deals", icon: Briefcase },
                { name: "Milestones", href: "/seller/milestones", icon: ShieldCheck },
                { name: "Payments", href: "/seller/payments", icon: CreditCard },
                ...baseLinks
            ];
        }

        return [
            { name: "Overview", href: "/buyer", icon: Briefcase },
            { name: "My Deals", href: "/buyer/deals", icon: Briefcase },
            { name: "Funded Milestones", href: "/buyer/milestones", icon: ShieldCheck },
            { name: "Payments", href: "/buyer/payments", icon: CreditCard },
            ...baseLinks
        ];
    };

    const navLinks = getNavLinks();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <span className="text-xl font-bold text-blue-600 tracking-tight">FINX</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon size={18} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {user?.fullName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white w-64 z-50 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
                    <span className="text-xl font-bold text-blue-600 tracking-tight">FINX</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon size={18} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800 capitalize">
                            {pathname.split("/")[1] || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors">
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
