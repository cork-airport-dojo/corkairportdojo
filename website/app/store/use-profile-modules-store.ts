import { create } from "zustand";
import { supabase } from "~/lib/supabase/browser";

export interface ProfileModuleRecord {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: string;
    icon_key: string | null;
    featured: boolean;
    published: boolean;
    overview: string[];
    created_by: string | null;
    created_at: string;
    updated_at: string;
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
    const { data, error } = await supabase
        .from("modules")
        .select("id, slug, title, description, topic, difficulty, icon_key, featured, published, overview, created_by, created_at, updated_at")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

async function deleteProfileModule(id: string): Promise<void> {
    const { error } = await supabase
        .from("modules")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}

export const useProfileModulesStore = create<ProfileModulesState>((set) => ({
    modules: [],
    isLoading: false,
    error: null,

    hydrate: async () => {
        set({ isLoading: true, error: null });
        try {
            const modules = await fetchProfileModules();
            set({ modules, isLoading: false, error: null });
        } catch (error) {
            console.error("Failed to hydrate profile modules:", error);
            set({
                modules: [],
                isLoading: false,
                error: error instanceof Error ? error.message : "Failed to load modules.",
            });
        }
    },

    removeModule: async (id: string) => {
        try {
            await deleteProfileModule(id);
            set((state) => ({ modules: state.modules.filter((m) => m.id !== id), error: null }));
        } catch (error) {
            console.error(`Failed to delete module "${id}":`, error);
            set({ error: error instanceof Error ? error.message : "Failed to delete module." });
            throw error;
        }
    },

    setModules: (modules) => set({ modules }),
    clearError: () => set({ error: null }),
}));