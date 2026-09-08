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
        else if (role === "SELLER") router.push("/seller");
        else router.push("/buyer");
    };

    // Route guarding
    useEffect(() => {
        if (isLoading) return;

        const isPublicRoute = ["/", "/login", "/register"].includes(pathname as string);

        if (!user && !isPublicRoute) {
            router.push("/login");
        } else if (user && isPublicRoute && pathname !== "/") {
            redirectBasedOnRole(user.role);
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
