import { create } from "zustand";
import {
    POST_EDITOR_STORAGE_KEY,
    type PostEditorFormData,
} from "~/lib/post-editor";

interface StoredDraftPayload extends PostEditorFormData {
    articleId: string | null;
    articleSlug: string | null;
}

interface HydrateArticleInput {
    articleId: string;
    articleSlug: string;
    title: string;
    description: string;
    category: string;
    tags?: string[];
    coverImage: string;
    content: string;
    markdownMode?: boolean;
    status: "draft" | "review" | "published";
}

interface PostEditorState extends PostEditorFormData {
    articleId: string | null;
    articleSlug: string | null;
    commandPaletteOpen: boolean;
    lastSavedAt: string | null;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setCategory: (value: string) => void;
    setTags: (value: string[]) => void;
    addTag: (value: string) => void;
    removeTag: (value: string) => void;
    setCoverImage: (value: string) => void;
    setContent: (value: string) => void;
    setMarkdownMode: (value: boolean) => void;
    setStatus: (value: "draft" | "review" | "published") => void;
    setCommandPaletteOpen: (value: boolean) => void;
    setArticleIdentity: (input: { articleId: string; articleSlug: string }) => void;
    hydrateFromArticle: (input: HydrateArticleInput) => void;
    saveDraft: () => void;
    loadDraft: () => void;
    clearDraft: () => void;
    resetEditor: () => void;
}

const initialState: PostEditorFormData = {
    title: "",
    description: "",
    category: "Web Development",
    tags: ["Next.js", "React", "TypeScript"],
    coverImage: "",
    content: "",
    markdownMode: false,
    status: "draft",
};

const resetState = {
    ...initialState,
    articleId: null,
    articleSlug: null,
    commandPaletteOpen: false,
    lastSavedAt: null,
};

export const usePostEditorStore = create<PostEditorState>((set, get) => ({
    ...resetState,

    setTitle: (value) => set({ title: value }),
    setDescription: (value) => set({ description: value }),
    setCategory: (value) => set({ category: value }),
    setTags: (value) => set({ tags: value }),

    addTag: (value) =>
        set((state) => {
            const tag = value.trim();
            if (!tag || state.tags.includes(tag)) return state;
            return { tags: [...state.tags, tag] };
        }),

    removeTag: (value) =>
        set((state) => ({
            tags: state.tags.filter((tag) => tag !== value),
        })),

    setCoverImage: (value) => set({ coverImage: value }),
    setContent: (value) => set({ content: value }),
    setMarkdownMode: (value) => set({ markdownMode: value }),
    setStatus: (value) => set({ status: value }),
    setCommandPaletteOpen: (value) => set({ commandPaletteOpen: value }),

    setArticleIdentity: ({ articleId, articleSlug }) =>
        set({
            articleId,
            articleSlug,
        }),

    hydrateFromArticle: (input) =>
        set({
            articleId: input.articleId,
            articleSlug: input.articleSlug,
            title: input.title,
            description: input.description,
            category: input.category,
            tags: input.tags ?? [],
            coverImage: input.coverImage,
            content: input.content,
            markdownMode: input.markdownMode ?? false,
            status: input.status,
            lastSavedAt: null,
        }),

    saveDraft: () => {
        const state = get();

        const payload: StoredDraftPayload = {
            title: state.title,
            description: state.description,
            category: state.category,
            tags: state.tags,
            coverImage: state.coverImage,
            content: state.content,
            markdownMode: state.markdownMode,
            status: state.status,
            articleId: state.articleId,
            articleSlug: state.articleSlug,
        };

        localStorage.setItem(POST_EDITOR_STORAGE_KEY, JSON.stringify(payload));
        set({ lastSavedAt: new Date().toISOString() });
    },

    loadDraft: () => {
        const draft = localStorage.getItem(POST_EDITOR_STORAGE_KEY);
        if (!draft) return;

        try {
            const parsed = JSON.parse(draft) as StoredDraftPayload;
            set({
                title: parsed.title ?? "",
                description: parsed.description ?? "",
                category: parsed.category ?? "Web Development",
                tags: parsed.tags ?? [],
                coverImage: parsed.coverImage ?? "",
                content: parsed.content ?? "",
                markdownMode: parsed.markdownMode ?? false,
                status: parsed.status ?? "draft",
                articleId: parsed.articleId ?? null,
                articleSlug: parsed.articleSlug ?? null,
            });
        } catch {
            localStorage.removeItem(POST_EDITOR_STORAGE_KEY);
        }
    },

    clearDraft: () => {
        localStorage.removeItem(POST_EDITOR_STORAGE_KEY);
        set({
            ...resetState,
        });
    },

    resetEditor: () => {
        set({
            ...resetState,
        });
    },
}));