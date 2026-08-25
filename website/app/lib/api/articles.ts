import { supabase } from "~/lib/supabase/browser";

export interface PublicArticleResource {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
}

export interface PublicArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    markdown: string;
    author_name: string | null;
    author_avatar_url: string | null;
    cover_image: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    module: string | null;
    created_at: string;
    updated_at: string;
    resources?: PublicArticleResource[];
}

interface FetchArticlesOptions {
    page?: number;
    pageSize?: number;
}

export async function fetchArticles(options?: FetchArticlesOptions): Promise<PublicArticle[]> {
    let query = supabase
        .from("articles")
        .select("*, resources:article_resources(resource:resources(*))")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (options?.pageSize) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const from = (page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return (data ?? []).map(normalizeArticle);
}

export async function fetchArticleBySlug(slug: string): Promise<PublicArticle | null> {
    const { data, error } = await supabase
        .from("articles")
        .select("*, resources:article_resources(resource:resources(*))")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return normalizeArticle(data);
}

export async function fetchArticlesForModule(
    module_id: string,
    options?: FetchArticlesOptions,
): Promise<PublicArticle[]> {
    let query = supabase
        .from("articles")
        .select("*, resources:article_resources(resource:resources(*))")
        .eq("published", true)
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
    return (data ?? []).map(normalizeArticle);
}

// Flatten the nested join shape { resource: {...} }[] into PublicArticleResource[]
function normalizeArticle(row: Record<string, unknown>): PublicArticle {
    const rawResources = (row.resources ?? []) as { resource: PublicArticleResource }[];
    const resources = rawResources.map((r) => r.resource).filter(Boolean);
    const { ...rest } = row as PublicArticle & { resources: unknown };
    return { ...rest, resources };
}
