import { create } from "zustand";
import type { ModuleItem } from "~/lib/constants/modules";
import {
    materializeStoredModule,
    slugifyModuleId,
    type StoredModuleItem,
    type ModuleIconKey,
} from "~/lib/modules";

const CUSTOM_MODULES_STORAGE_KEY = "corkairportdojo-custom-modules";

interface CreateModuleInput {
    title: string;
    description: string;
    difficulty: ModuleItem["difficulty"];
    topic: string;
    iconKey: ModuleIconKey;
    featured: boolean;
    overview: string[];
}

interface CustomModulesState {
    modules: StoredModuleItem[];
    hydrate: () => void;
    createModule: (input: CreateModuleInput) => void;
    updateModule: (id: string, input: CreateModuleInput) => void;
    removeModule: (id: string) => void;
    getMaterializedModules: () => ModuleItem[];
}

function readStoredModules(): StoredModuleItem[] {
    const raw = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as StoredModuleItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeStoredModules(modules: StoredModuleItem[]) {
    localStorage.setItem(CUSTOM_MODULES_STORAGE_KEY, JSON.stringify(modules));
}

export const useCustomModulesStore = create<CustomModulesState>((set, get) => ({
    modules: [],

    hydrate: () => {
        set({ modules: readStoredModules() });
    },

    createModule: (input) => {
        const title = input.title.trim();
        const description = input.description.trim();
        const overview = input.overview.map((item) => item.trim()).filter(Boolean);

        if (!title || !description || !overview.length) return;

        const baseId = slugifyModuleId(title);
        let nextId = baseId;
        let counter = 2;

        while (get().modules.some((module) => module.id === nextId)) {
            nextId = `${baseId}-${counter}`;
            counter += 1;
        }

        const nextModule: StoredModuleItem = {
            id: nextId,
            title,
            description,
            difficulty: input.difficulty,
            topic: input.topic.trim(),
            iconKey: input.iconKey,
            featured: input.featured,
            overview,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const next = [...get().modules, nextModule];
        writeStoredModules(next);
        set({ modules: next });
    },

    updateModule: (id, input) => {
        const title = input.title.trim();
        const description = input.description.trim();
        const overview = input.overview.map((item) => item.trim()).filter(Boolean);

        if (!title || !description || !overview.length) return;

        const next = get().modules.map((module) =>
            module.id === id
                ? {
                    ...module,
                    title,
                    description,
                    difficulty: input.difficulty,
                    topic: input.topic.trim(),
                    iconKey: input.iconKey,
                    featured: input.featured,
                    overview,
                    updatedAt: new Date().toISOString(),
                }
                : module
        );

        writeStoredModules(next);
        set({ modules: next });
    },

    removeModule: (id) => {
        const next = get().modules.filter((module) => module.id !== id);
        writeStoredModules(next);
        set({ modules: next });
    },

    getMaterializedModules: () => {
        return get().modules.map(materializeStoredModule);
    },
}));