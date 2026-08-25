import { create } from "zustand";
import { supabase } from "~/lib/supabase/browser";

export interface ProfileArticleRecord {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    author_name: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

interface ProfileArticlesState {
    articles: ProfileArticleRecord[];
    isLoading: boolean;
    error: string | null;
    hydrate: () => Promise<void>;
    removeArticle: (id: string) => Promise<void>;
    setArticles: (articles: ProfileArticleRecord[]) => void;
    clearError: () => void;
}

async function fetchProfileArticles(): Promise<ProfileArticleRecord[]> {
    const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, author_name, read_time, featured, published, created_by, created_at, updated_at")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

async function deleteProfileArticle(id: string): Promise<void> {
    const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}

export const useProfileArticlesStore = create<ProfileArticlesState>((set) => ({
    articles: [],
    isLoading: false,
    error: null,

    hydrate: async () => {
        set({ isLoading: true, error: null });
        try {
            const articles = await fetchProfileArticles();
            set({ articles, isLoading: false, error: null });
        } catch (error) {
            console.error("Failed to hydrate profile articles:", error);
            set({
                articles: [],
                isLoading: false,
                error: error instanceof Error ? error.message : "Failed to load articles.",
            });
        }
    },

    removeArticle: async (id: string) => {
        try {
            await deleteProfileArticle(id);
            set((state) => ({ articles: state.articles.filter((a) => a.id !== id), error: null }));
        } catch (error) {
            console.error(`Failed to delete article "${id}":`, error);
            set({ error: error instanceof Error ? error.message : "Failed to delete article." });
            throw error;
        }
    },

    setArticles: (articles) => set({ articles }),
    clearError: () => set({ error: null }),
}));