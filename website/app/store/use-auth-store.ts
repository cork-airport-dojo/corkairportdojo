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
    return metadata.avatar_url || "";
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
        const {
            data: { user },
        } = await supabase.auth.getUser();

        set({
            isAuthenticated: Boolean(user),
            isLoading: false,
            user: user ?? null,
            userName: getUserName(user ?? null),
            avatarUrl: getAvatarUrl(user ?? null),
            role: null,
            isAdmin: false,
        });
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Sign out failed:", error);
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
    },

    setRole: (role) => {
        set({
            role,
            isAdmin: role === "admin",
        });
    },
}));