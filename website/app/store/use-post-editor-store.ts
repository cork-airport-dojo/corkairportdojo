import { create } from "zustand";
import {
    POST_EDITOR_STORAGE_KEY,
    type PostEditorFormData,
} from "~/lib/post-editor";

interface PostEditorState extends PostEditorFormData {
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
    saveDraft: () => void;
    loadDraft: () => void;
    clearDraft: () => void;
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

export const usePostEditorStore = create<PostEditorState>((set, get) => ({
    ...initialState,
    commandPaletteOpen: false,
    lastSavedAt: null,

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

    saveDraft: () => {
        const state = get();

        const payload: PostEditorFormData = {
            title: state.title,
            description: state.description,
            category: state.category,
            tags: state.tags,
            coverImage: state.coverImage,
            content: state.content,
            markdownMode: state.markdownMode,
            status: state.status,
        };

        localStorage.setItem(POST_EDITOR_STORAGE_KEY, JSON.stringify(payload));
        set({ lastSavedAt: new Date().toISOString() });
    },

    loadDraft: () => {
        const draft = localStorage.getItem(POST_EDITOR_STORAGE_KEY);
        if (!draft) return;

        try {
            const parsed = JSON.parse(draft) as PostEditorFormData;
            set({
                ...parsed,
            });
        } catch {
            localStorage.removeItem(POST_EDITOR_STORAGE_KEY);
        }
    },

    clearDraft: () => {
        localStorage.removeItem(POST_EDITOR_STORAGE_KEY);
        set({
            ...initialState,
            lastSavedAt: null,
        });
    },
}));