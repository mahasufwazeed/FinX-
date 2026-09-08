"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role } from "@/types";
import { authService } from "@/services/auth.service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: Record<string, string>) => Promise<void>;
    register: (data: Record<string, string>) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken");
            const storedUser = localStorage.getItem("user");

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user");
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: Record<string, string>) => {
        const data = await authService.login(credentials);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        redirectBasedOnRole(data.user.role);
    };

    const register = async (userData: Record<string, string>) => {
        const data = await authService.register(userData);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        redirectBasedOnRole(data.user.role);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push("/login");
    };

    const redirectBasedOnRole = (role: Role) => {
        if (role === "ADMIN") router.push("/admin");
        else if (role === "FINANCE") router.push("/finance");
        else if (role === "PROJECT_MANAGER") router.push("/project-manager");
        else if (role === "VENDOR") router.push("/vendor");
        else router.push("/corporate");
    };

    // Route guarding
    useEffect(() => {
        if (isLoading) return;

        const isPublicRoute = ["/", "/login", "/register"].includes(pathname as string);

        if (!user && !isPublicRoute) {
            router.push("/login");
            return;
        }

        if (user && isPublicRoute && pathname !== "/") {
            redirectBasedOnRole(user.role);
            return;
        }

        // Role-based protection logic
        if (user && pathname) {
            if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
                redirectBasedOnRole(user.role);
            } else if (pathname.startsWith("/finance") && user.role !== "FINANCE" && user.role !== "ADMIN") {
                redirectBasedOnRole(user.role);
            } else if (pathname.startsWith("/project-manager") && user.role !== "PROJECT_MANAGER" && user.role !== "ADMIN") {
                redirectBasedOnRole(user.role);
            } else if (pathname.startsWith("/vendor") && user.role !== "VENDOR") {
                redirectBasedOnRole(user.role);
            } else if (pathname.startsWith("/corporate") && user.role !== "CORPORATE") {
                redirectBasedOnRole(user.role);
            }
        }

    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
