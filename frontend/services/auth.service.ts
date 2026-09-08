import { api } from "@/lib/api";
import { AuthResponse, User } from "@/types";

export const authService = {
    login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", credentials);
        return response.data;
    },

    register: async (userData: Record<string, string>): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", userData);
        return response.data;
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            // Proceed with local cleanup regardless
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>("/auth/me");
        return response.data;
    },
};
