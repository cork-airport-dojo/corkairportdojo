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

export async function fetchFeaturedModules(): Promise<PublicModule[]> {
    const response = await fetch("/api/modules/featured");

    if (!response.ok) {
        throw new Error("Failed to fetch featured modules");
    }

    const payload = (await response.json()) as { modules?: PublicModule[] };
    return payload.modules ?? [];
}