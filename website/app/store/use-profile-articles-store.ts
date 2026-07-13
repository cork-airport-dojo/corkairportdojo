import { create } from "zustand";

export interface ProfileArticleRecord {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    author_name: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

interface ProfileArticlesResponse {
    articles?: ProfileArticleRecord[];
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
    const response = await fetch("/api/profile/articles", {
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

        throw new Error(payload?.message || "Failed to load profile articles.");
    }

    const payload = (await response.json()) as ProfileArticlesResponse;
    return payload.articles ?? [];
}

async function deleteProfileArticle(id: string): Promise<void> {
    const response = await fetch(`/api/profile/articles/${id}`, {
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

        throw new Error(payload?.message || "Failed to delete article.");
    }
}

export const useProfileArticlesStore = create<ProfileArticlesState>((set) => ({
    articles: [],
    isLoading: false,
    error: null,

    hydrate: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const articles = await fetchProfileArticles();

            set({
                articles,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error("Failed to hydrate profile articles:", error);

            set({
                articles: [],
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load articles.",
            });
        }
    },

    removeArticle: async (id: string) => {
        try {
            await deleteProfileArticle(id);

            set((state) => ({
                articles: state.articles.filter((article) => article.id !== id),
                error: null,
            }));
        } catch (error) {
            console.error(`Failed to delete article "${id}":`, error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete article.",
            });

            throw error;
        }
    },

    setArticles: (articles) => {
        set({
            articles,
        });
    },

    clearError: () => {
        set({
            error: null,
        });
    },
}));