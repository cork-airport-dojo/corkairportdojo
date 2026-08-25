import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase/browser";

export type UserRole = "admin" | "editor" | undefined;

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    userName: string;
    avatarUrl: string;
    role: UserRole | undefined;
    isAdmin: boolean;
    canManageContent: boolean;
    hydrate: () => Promise<void>;
    signInWithGitHub: (redirectTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
    setRole: (role: UserRole | undefined) => void;
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

async function fetchCurrentUserRole(userId: string): Promise<UserRole | undefined> {
    const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
    return (data?.role as UserRole) ?? undefined;
}

function mapRoleState(role: UserRole | undefined) {
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
    role: undefined,
    isAdmin: false,
    canManageContent: false,

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
                    ...mapRoleState(undefined),
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
                    ...mapRoleState(undefined),
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
                const role = await fetchCurrentUserRole(user.id);

                set({
                    ...baseState,
                    ...mapRoleState(role),
                });
            } catch (roleError) {
                console.error("Failed to hydrate user role:", roleError);

                set({
                    ...baseState,
                    ...mapRoleState(undefined),
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
                ...mapRoleState(undefined),
            });
        }
    },

    signInWithGitHub: async (redirectTo = "/profile") => {
        const callbackUrl = new URL("/auth/callback", window.location.origin);
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
    await supabase.auth.signOut();
    set({ isAuthenticated: false, isLoading: false, user: null });
    window.location.assign("/");  // was "/logout"
    },


    setRole: (role: UserRole | undefined) => {
        set({
            ...mapRoleState(role),
        });
    },
}));