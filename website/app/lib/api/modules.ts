export interface PublicModule {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: string | null;
    lessons: number;
    featured: boolean;
    published: boolean;
    views: number;
    overview: string[];
    created_at: string;
    updated_at: string;
}

export async function fetchModules(): Promise<PublicModule[]> {
    const response = await fetch("/api/modules/published");

    if (!response.ok) {
        throw new Error("Failed to fetch modules");
    }

    const payload = (await response.json()) as { modules?: PublicModule[] };
    return payload.modules ?? [];
}

export async function fetchModuleBySlug(
    slug: string
): Promise<PublicModule | null> {
    const response = await fetch(`/api/modules/published/${slug}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch module");
    }

    const payload = (await response.json()) as { module?: PublicModule | null };
    return payload.module ?? null;
}