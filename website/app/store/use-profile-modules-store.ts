import { create } from "zustand";

export interface ProfileModuleRecord {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: string;
    lessons: number;
    icon_key: string | null;
    featured: boolean;
    published: boolean;
    overview: string[];
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

interface ProfileModulesResponse {
    modules?: ProfileModuleRecord[];
}

interface ProfileModulesState {
    modules: ProfileModuleRecord[];
    isLoading: boolean;
    error: string | null;
    hydrate: () => Promise<void>;
    removeModule: (id: string) => Promise<void>;
    setModules: (modules: ProfileModuleRecord[]) => void;
    clearError: () => void;
}

async function fetchProfileModules(): Promise<ProfileModuleRecord[]> {
    const response = await fetch("/api/profile/modules", {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;

        throw new Error(payload?.message || "Failed to load profile modules.");
    }

    const payload = (await response.json()) as ProfileModulesResponse;
    return payload.modules ?? [];
}

async function deleteProfileModule(id: string): Promise<void> {
    const response = await fetch(`/api/profile/modules/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;

        throw new Error(payload?.message || "Failed to delete module.");
    }
}

export const useProfileModulesStore = create<ProfileModulesState>((set) => ({
    modules: [],
    isLoading: false,
    error: null,

    hydrate: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const modules = await fetchProfileModules();

            set({
                modules,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error("Failed to hydrate profile modules:", error);

            set({
                modules: [],
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load modules.",
            });
        }
    },

    removeModule: async (id: string) => {
        try {
            await deleteProfileModule(id);

            set((state) => ({
                modules: state.modules.filter((module) => module.id !== id),
                error: null,
            }));
        } catch (error) {
            console.error(`Failed to delete module "${id}":`, error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete module.",
            });

            throw error;
        }
    },

    setModules: (modules) => {
        set({
            modules,
        });
    },

    clearError: () => {
        set({
            error: null,
        });
    },
}));