import { supabase } from "~/lib/supabase/browser";

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
    module: string | null | undefined;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateResourceRequest {
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    module: string | null;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
    active?: boolean;
}

export interface UpdateResourceRequest extends CreateResourceRequest {
    id: string;
}

export async function fetchResources(): Promise<ResourceRecord[]> {
    const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

interface FetchResourcesOptions {
    page?: number;
    pageSize?: number;
}

export async function fetchResourcesForModule(
    module_id: string,
    options?: FetchResourcesOptions,
): Promise<ResourceRecord[]> {
    let query = supabase
        .from("resources")
        .select("*")
        .eq("active", true)
        .eq("module", module_id)
        .order("created_at", { ascending: false });

    if (options?.pageSize) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const from = (page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function createResourceRequest(input: CreateResourceRequest): Promise<ResourceRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("resources")
        .insert({ ...input, created_by: user.id })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateResourceRequest(input: UpdateResourceRequest): Promise<ResourceRecord> {
    const { id, ...fields } = input;

    const { data, error } = await supabase
        .from("resources")
        .update(fields)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteResourceRequest(id: string): Promise<void> {
    const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}