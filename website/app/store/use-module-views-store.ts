import { create } from "zustand";

const MODULE_VIEWS_STORAGE_KEY = "corkairportdojo-module-views";

type ModuleViews = Record<string, number>;

interface ModuleViewsState {
    views: ModuleViews;
    hydrate: () => void;
    incrementView: (moduleId: string) => void;
    getViews: (moduleId: string, fallback?: number) => number;
}

function readStoredViews(): ModuleViews {
    const raw = localStorage.getItem(MODULE_VIEWS_STORAGE_KEY);
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw) as ModuleViews;
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

function writeStoredViews(views: ModuleViews) {
    localStorage.setItem(MODULE_VIEWS_STORAGE_KEY, JSON.stringify(views));
}

export const useModuleViewsStore = create<ModuleViewsState>((set, get) => ({
    views: {},

    hydrate: () => {
        set({ views: readStoredViews() });
    },

    incrementView: (moduleId) => {
        const current = get().views[moduleId] ?? 0;
        const nextViews = {
            ...get().views,
            [moduleId]: current + 1,
        };

        writeStoredViews(nextViews);
        set({ views: nextViews });
    },

    getViews: (moduleId, fallback = 0) => {
        const stored = get().views[moduleId];
        return typeof stored === "number" ? stored : fallback;
    },
}));