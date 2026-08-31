import { supabase } from "~/lib/supabase/browser";

export interface PublicModule {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: string | null;
    featured: boolean;
    published: boolean;
    overview: string;
    created_at: string;
    updated_at: string;
    icon_key: string;
}

const MODULE_FIELDS = "id, slug, title, description, topic, difficulty, featured, published, overview, created_at, updated_at, icon_key";

export async function fetchModules(): Promise<PublicModule[]> {
    const { data, error } = await supabase
        .from("modules")
        .select(MODULE_FIELDS)
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function fetchFeaturedModules(): Promise<PublicModule[]> {
    const { data, error } = await supabase
        .from("modules")
        .select(MODULE_FIELDS)
        .eq("published", true)
        .eq("featured", true)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function fetchModuleById(id: string): Promise<PublicModule | null> {
    const { data, error } = await supabase
        .from("modules")
        .select(MODULE_FIELDS)
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
}

export async function fetchModuleBySlug(slug: string): Promise<PublicModule | null> {
    const { data, error } = await supabase
        .from("modules")
        .select(MODULE_FIELDS)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
}

