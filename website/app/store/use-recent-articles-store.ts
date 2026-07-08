import { create } from "zustand";

const RECENT_ARTICLES_STORAGE_KEY = "corkairportdojo-recent-articles";
const MAX_RECENT_ARTICLES = 5;

export interface RecentArticleItem {
    id: string;
    title: string;
    category: string;
    href: string;
    readAt: string;
}

interface RecentArticlesState {
    articles: RecentArticleItem[];
    hydrate: () => void;
    addArticle: (article: Omit<RecentArticleItem, "readAt">) => void;
    getRecentArticles: () => RecentArticleItem[];
}

function readStoredArticles(): RecentArticleItem[] {
    const raw = localStorage.getItem(RECENT_ARTICLES_STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as RecentArticleItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeStoredArticles(articles: RecentArticleItem[]) {
    localStorage.setItem(RECENT_ARTICLES_STORAGE_KEY, JSON.stringify(articles));
}

export const useRecentArticlesStore = create<RecentArticlesState>((set, get) => ({
    articles: [],

    hydrate: () => {
        set({ articles: readStoredArticles() });
    },

    addArticle: (article) => {
        const nextArticle: RecentArticleItem = {
            ...article,
            readAt: new Date().toISOString(),
        };

        const deduped = get().articles.filter((item) => item.id !== article.id);
        const next = [nextArticle, ...deduped].slice(0, MAX_RECENT_ARTICLES);

        writeStoredArticles(next);
        set({ articles: next });
    },

    getRecentArticles: () => {
        return [...get().articles].slice(0, MAX_RECENT_ARTICLES);
    },
}));