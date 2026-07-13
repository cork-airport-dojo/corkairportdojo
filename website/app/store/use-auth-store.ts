import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase/browser";

export type UserRole = "admin" | "editor" | "viewer";

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    userName: string;
    avatarUrl: string;
    role: UserRole | null;
    isAdmin: boolean;
    hydrate: () => Promise<void>;
    signInWithGitHub: (redirectTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
    setRole: (role: UserRole | null) => void;
}

interface MeResponse {
    user?: {
        id: string;
        email?: string | null;
        role?: UserRole | null;
    };
}

function getUserName(user: User | null) {
    if (!user) return "";

    const metadata = user.user_metadata ?? {};

    return (
        metadata.full_name ||
        metadata.name ||
        metadata.user_name ||
        metadata.preferred_username ||
        user.email ||
        ""
    );
}

function getAvatarUrl(user: User | null) {
    if (!user) return "";

    const metadata = user.user_metadata ?? {};
    return metadata.avatar_url || "";
}

async function fetchCurrentUserRole(): Promise<UserRole | null> {
    const response = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        if (response.status === 401) {
            return null;
        }

        throw new Error("Failed to load current user role.");
    }

    const payload = (await response.json()) as MeResponse;
    return payload.user?.role ?? null;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    userName: "",
    avatarUrl: "",
    role: null,
    isAdmin: false,

    hydrate: async () => {
        try {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                set({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    userName: "",
                    avatarUrl: "",
                    role: null,
                    isAdmin: false,
                });
                return;
            }

            if (!user) {
                set({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    userName: "",
                    avatarUrl: "",
                    role: null,
                    isAdmin: false,
                });
                return;
            }

            const role = await fetchCurrentUserRole();

            set({
                isAuthenticated: true,
                isLoading: false,
                user,
                userName: getUserName(user),
                avatarUrl: getAvatarUrl(user),
                role,
                isAdmin: role === "admin",
            });
        } catch (error) {
            set({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                userName: "",
                avatarUrl: "",
                role: null,
                isAdmin: false,
            });
        }
    },

    signInWithGitHub: async (redirectTo = "/profile") => {
        const callbackUrl = new URL("http://localhost:5173/auth/callback");
        callbackUrl.searchParams.set("next", redirectTo);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: callbackUrl.toString(),
            },
        });

        if (error) {
            throw error;
        }
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            userName: "",
            avatarUrl: "",
            role: null,
            isAdmin: false,
        });

        window.location.assign("/logout");
    },

    setRole: (role) => {
        set({
            role,
            isAdmin: role === "admin",
        });
    },
}));