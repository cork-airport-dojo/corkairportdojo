import { getSupabaseServerClient } from "~/lib/supabase/server";

export interface ModuleRecord {
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

export async function getFeaturedModules(): Promise<ModuleRecord[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_at, updated_at"
        )
        .eq("published", true)
        .eq("featured", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load featured modules:", error);
        return [];
    }

    return (data ?? []) as ModuleRecord[];
}