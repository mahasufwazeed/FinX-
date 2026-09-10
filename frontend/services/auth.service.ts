import { api } from "@/lib/api";
import { AuthResponse, User, GoogleOAuthConfig, ApiResponse } from "@/types";

export const authService = {
    login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse> | AuthResponse>("/auth/login", credentials);
        const data = (response.data as ApiResponse<AuthResponse>)?.data || (response.data as AuthResponse);
        if (data?.user) {
            data.user.fullName = data.user.name || data.user.fullName || "User";
            data.user.name = data.user.name || data.user.fullName || "User";
        }
        return data;
    },

    register: async (userData: Record<string, any>): Promise<AuthResponse> => {
        // Map frontend display roles to backend roles
        let backendRole = userData.role;
        if (backendRole === "CORPORATE") backendRole = "BUYER";
        if (backendRole === "VENDOR") backendRole = "SELLER";

        const payload = {
            name: userData.fullName || userData.name,
            email: userData.email,
            password: userData.password,
            role: backendRole,
        };

        const response = await api.post<ApiResponse<AuthResponse> | AuthResponse>("/auth/register", payload);
        const data = (response.data as ApiResponse<AuthResponse>)?.data || (response.data as AuthResponse);
        if (data?.user) {
            data.user.fullName = data.user.name || data.user.fullName || "User";
            data.user.name = data.user.name || data.user.fullName || "User";
        }
        return data;
    },

    getGoogleConfig: async (): Promise<GoogleOAuthConfig> => {
        try {
            const response = await api.get<ApiResponse<GoogleOAuthConfig> | GoogleOAuthConfig>("/auth/google/config");
            const data = (response.data as ApiResponse<GoogleOAuthConfig>)?.data || (response.data as GoogleOAuthConfig);
            return data || { configured: false };
        } catch {
            return { configured: false };
        }
    },

    googleLogin: async (code: string): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse> | AuthResponse>("/auth/google", { code });
        const data = (response.data as ApiResponse<AuthResponse>)?.data || (response.data as AuthResponse);
        if (data?.user) {
            data.user.fullName = data.user.name || data.user.fullName || "User";
            data.user.name = data.user.name || data.user.fullName || "User";
        }
        return data;
    },

    logout: async () => {
        try {
            const refreshToken = typeof window !== 'undefined' ? localStorage.getItem("refreshToken") : null;
            if (refreshToken) {
                await api.post("/auth/logout", { refreshToken });
            }
        } catch (e) {
            // Proceed with local cleanup regardless
        }
        if (typeof window !== 'undefined') {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User> | User>("/auth/me");
        const data = (response.data as ApiResponse<User>)?.data || (response.data as User);
        if (data) {
            data.fullName = data.name || data.fullName || "User";
            data.name = data.name || data.fullName || "User";
        }
        return data;
    },
};
