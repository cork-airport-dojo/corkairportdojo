import { create } from "zustand";
import type {
    CreateResourceRequest,
    ResourceRecord,
    UpdateResourceRequest,
} from "~/lib/api/resources";
import {
    createResourceRequest,
    deleteResourceRequest,
    fetchResources,
    updateResourceRequest,
} from "~/lib/api/resources";

interface ResourcesState {
    resources: ResourceRecord[];
    isLoading: boolean;
    error: string | null;
    hydrate: () => Promise<void>;
    createResource: (input: CreateResourceRequest) => Promise<void>;
    updateResource: (input: UpdateResourceRequest) => Promise<void>;
    deleteResource: (id: string) => Promise<void>;
}

export const useResourcesStore = create<ResourcesState>((set) => ({
    resources: [],
    isLoading: false,
    error: null,

    hydrate: async () => {
        set({ isLoading: true, error: null });

        try {
            const resources = await fetchResources();
            set({ resources, isLoading: false, error: null });
        } catch (error) {
            set({
                resources: [],
                isLoading: false,
                error: error instanceof Error ? error.message : "Failed to load resources.",
            });
        }
    },

    createResource: async (input) => {
        const resource = await createResourceRequest(input);

        set((state) => ({
            resources: [resource, ...state.resources],
            error: null,
        }));
    },

    updateResource: async (input) => {
        const updated = await updateResourceRequest(input);

        set((state) => ({
            resources: state.resources.map((resource) =>
                resource.id === updated.id ? updated : resource
            ),
            error: null,
        }));
    },

    deleteResource: async (id) => {
        await deleteResourceRequest(id);

        set((state) => ({
            resources: state.resources.filter((resource) => resource.id !== id),
            error: null,
        }));
    },
}));