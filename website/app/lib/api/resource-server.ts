import { getSupabaseAdminClient, getSupabaseServerClient } from "~/lib/supabase/server";
import type {
    CreateResourceInput,
    UpdateResourceInput,
} from "~/lib/api/resource-schema.server";
import { getUserRole } from "~/lib/api/authz.server";

export interface ResourceRecord {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
    active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export async function getResources(): Promise<ResourceRecord[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("resources")
        .select(
            "id, title, description, category, tags, image, provider, href, active, created_by, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load resources:", error);
        return [];
    }

    return (data ?? []) as ResourceRecord[];
}

export async function createResource(
    input: CreateResourceInput,
    userId: string
): Promise<ResourceRecord> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("resources")
        .insert({
            title: input.title,
            description: input.description,
            category: input.category,
            tags: input.tags,
            image: input.image,
            provider: input.provider,
            href: input.href,
            active: input.active ?? true,
            created_by: userId,
        })
        .select(
            "id, title, description, category, tags, image, provider, href, active, created_by, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to create resource:", error);
        throw new Response(
            JSON.stringify({
                error: "ResourceCreateFailed",
                message: "Unable to create resource.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return data as ResourceRecord;
}

export async function updateResource(
    input: UpdateResourceInput,
    userId: string
): Promise<ResourceRecord> {
    const supabase = getSupabaseAdminClient();
    const role = await getUserRole(userId);

    const { data: existing, error: existingError } = await supabase
        .from("resources")
        .select("id, created_by")
        .eq("id", input.id)
        .maybeSingle();

    if (existingError || !existing) {
        throw new Response(
            JSON.stringify({
                error: "ResourceNotFound",
                message: "Resource could not be found.",
            }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (existing.created_by !== userId && !["admin", "editor"].includes(role ?? "")) {
        throw new Response(
            JSON.stringify({
                error: "Forbidden",
                message: "You do not have permission to update this resource.",
            }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const { data, error } = await supabase
        .from("resources")
        .update({
            title: input.title,
            description: input.description,
            category: input.category,
            tags: input.tags,
            image: input.image,
            provider: input.provider,
            href: input.href,
            active: input.active,
        })
        .eq("id", input.id)
        .select(
            "id, title, description, category, tags, image, provider, href, active, created_by, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error(`Failed to update resource "${input.id}":`, error);
        throw new Response(
            JSON.stringify({
                error: "ResourceUpdateFailed",
                message: "Unable to update resource.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return data as ResourceRecord;
}

export async function deleteResource(id: string, userId: string): Promise<void> {
    const supabase = getSupabaseAdminClient();
    const role = await getUserRole(userId);

    const { data: existing, error: existingError } = await supabase
        .from("resources")
        .select("id, created_by")
        .eq("id", id)
        .maybeSingle();

    if (existingError || !existing) {
        throw new Response(
            JSON.stringify({
                error: "ResourceNotFound",
                message: "Resource could not be found.",
            }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (existing.created_by !== userId && !["admin", "editor"].includes(role ?? "")) {
        throw new Response(
            JSON.stringify({
                error: "Forbidden",
                message: "You do not have permission to delete this resource.",
            }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
        console.error(`Failed to delete resource "${id}":`, error);
        throw new Response(
            JSON.stringify({
                error: "ResourceDeleteFailed",
                message: "Unable to delete resource.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}