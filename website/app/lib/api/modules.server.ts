import { getSupabaseAdminClient, getSupabaseServerClient } from "~/lib/supabase/server";
import { requireOwnerOrPrivilegedRole } from "~/lib/api/permissions.server";

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
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateModuleInput {
    slug: string;
    title: string;
    description?: string;
    topic?: string;
    difficulty?: string;
    lessons?: number;
    featured?: boolean;
    published?: boolean;
    views?: number;
    overview?: string[];
}

export interface UpdateModuleInput extends CreateModuleInput {
    id: string;
}

export async function getFeaturedModules(): Promise<ModuleRecord[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
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

export async function getModuleById(id: string): Promise<ModuleRecord | null> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
        )
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error(`Failed to load module "${id}":`, error);
        return null;
    }

    return (data ?? null) as ModuleRecord | null;
}

export async function createModule(
    input: CreateModuleInput,
    createdBy: string
): Promise<ModuleRecord> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("modules")
        .insert({
            slug: input.slug,
            title: input.title,
            description: input.description ?? null,
            topic: input.topic ?? null,
            difficulty: input.difficulty ?? null,
            lessons: input.lessons ?? 0,
            featured: input.featured ?? false,
            published: input.published ?? false,
            views: input.views ?? 0,
            overview: input.overview ?? [],
            created_by: createdBy,
        })
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to create module:", error);
        throw new Response(
            JSON.stringify({
                error: "ModuleCreateFailed",
                message:
                    error.code === "23505"
                        ? "A module with this slug already exists."
                        : "Unable to create module.",
            }),
            {
                status: error.code === "23505" ? 409 : 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return data as ModuleRecord;
}

export async function updateModule(
    input: UpdateModuleInput,
    userId: string
): Promise<ModuleRecord> {
    const supabase = getSupabaseAdminClient();

    const existing = await getModuleById(input.id);

    if (!existing) {
        throw new Response(
            JSON.stringify({
                error: "ModuleNotFound",
                message: "Module could not be found for update.",
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    await requireOwnerOrPrivilegedRole(userId, existing.created_by);

    const { data, error } = await supabase
        .from("modules")
        .update({
            slug: input.slug,
            title: input.title,
            description: input.description ?? null,
            topic: input.topic ?? null,
            difficulty: input.difficulty ?? null,
            lessons: input.lessons ?? 0,
            featured: input.featured ?? false,
            published: input.published ?? false,
            views: input.views ?? 0,
            overview: input.overview ?? [],
        })
        .eq("id", input.id)
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to update module:", error);
        throw new Response(
            JSON.stringify({
                error: "ModuleUpdateFailed",
                message:
                    error.code === "23505"
                        ? "A module with this slug already exists."
                        : "Unable to update module.",
            }),
            {
                status: error.code === "23505" ? 409 : 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return data as ModuleRecord;
}

export async function deleteModule(
    id: string,
    userId: string
): Promise<void> {
    const supabase = getSupabaseAdminClient();

    const existing = await getModuleById(id);

    if (!existing) {
        throw new Response(
            JSON.stringify({
                error: "ModuleNotFound",
                message: "Module could not be found for deletion.",
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    await requireOwnerOrPrivilegedRole(userId, existing.created_by);

    const { error } = await supabase
        .from("modules")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Failed to delete module:", error);
        throw new Response(
            JSON.stringify({
                error: "ModuleDeleteFailed",
                message: "Unable to delete module.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}