import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase/browser";

export type UserRole = "admin" | "editor" | "viewer";

interface MeResponse {
    user?: {
        id: string;
        email?: string | null;
        role?: UserRole | null;
    };
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    userName: string;
    avatarUrl: string;
    role: UserRole | null;
    isAdmin: boolean;
    canManageContent: boolean;
    hydrate: () => Promise<void>;
    signInWithGitHub: (redirectTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
    setRole: (role: UserRole | null) => void;
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

    return (
        metadata.avatar_url ||
        metadata.picture ||
        ""
    );
}

async function fetchCurrentUserRole(): Promise<UserRole | null> {
    const response = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to load current user role.");
    }

    const payload = (await response.json()) as MeResponse;
    return payload.user?.role ?? null;
}

function mapRoleState(role: UserRole | null) {
    return {
        role,
        isAdmin: role === "admin",
        canManageContent: role === "admin" || role === "editor",
    };
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    userName: "",
    avatarUrl: "",
    role: null,
    isAdmin: false,
    canManageContent: false,

    hydrate: async () => {
        try {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error("Failed to hydrate auth user:", error);
                set({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    userName: "",
                    avatarUrl: "",
                    ...mapRoleState(null),
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
                    ...mapRoleState(null),
                });
                return;
            }

            const baseState = {
                isAuthenticated: true,
                isLoading: false,
                user,
                userName: getUserName(user),
                avatarUrl: getAvatarUrl(user),
            };

            try {
                const role = await fetchCurrentUserRole();

                set({
                    ...baseState,
                    ...mapRoleState(role),
                });
            } catch (roleError) {
                console.error("Failed to hydrate user role:", roleError);

                set({
                    ...baseState,
                    ...mapRoleState(null),
                });
            }
        } catch (error) {
            console.error("Auth hydrate failed:", error);
            set({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                userName: "",
                avatarUrl: "",
                ...mapRoleState(null),
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
            console.error("GitHub sign-in failed:", error);
            throw error;
        }
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("GitHub sign-out failed:", error);
            throw error;
        }

        set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            userName: "",
            avatarUrl: "",
            ...mapRoleState(null),
        });

        window.location.assign("/logout");
    },

    setRole: (role) => {
        set({
            ...mapRoleState(role),
        });
    },
}));