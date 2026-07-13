import { getSupabaseAdminClient, getSupabaseServerClient } from "~/lib/supabase/server";
import type {
    CreateArticleInput,
    UpdateArticleInput,
} from "~/lib/api/article-schema.server";
import { getUserRole } from "~/lib/api/authz.server";

export interface ArticleRecord {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string[];
    category: string | null;
    author_name: string | null;
    author_avatar_url: string | null;
    cover_image: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    created_at: string;
    updated_at: string;
}

export async function getPublishedArticles(): Promise<ArticleRecord[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("articles")
        .select(
            "id, slug, title, excerpt, body, category, author_name, author_avatar_url, cover_image, read_time, featured, published, created_at, updated_at"
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load published articles:", error);
        return [];
    }

    return (data ?? []) as ArticleRecord[];
}

export async function getPublishedArticleBySlug(
    slug: string
): Promise<ArticleRecord | null> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("articles")
        .select(
            "id, slug, title, excerpt, category, author_name, author_avatar_url, cover_image, read_time, featured, published, body, created_at, updated_at"
        )
        .eq("published", true)
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        console.error(`Failed to load article for slug "${slug}":`, error);
        return null;
    }

    return (data ?? null) as ArticleRecord | null;
}

export async function createArticle(
    input: CreateArticleInput & { author_avatar_url?: string | null },
    createdBy: string
): Promise<ArticleRecord> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("articles")
        .insert({
            slug: input.slug,
            title: input.title,
            excerpt: input.excerpt || null,
            body: input.body,
            category: input.category || "General",
            author_name: input.author_name || null,
            author_avatar_url: input.author_avatar_url || null,
            cover_image: input.cover_image || null,
            read_time: input.read_time || null,
            featured: input.featured ?? false,
            published: input.published ?? false,
            created_by: createdBy,
        })
        .select(
            "id, slug, title, excerpt, body, category, author_name, author_avatar_url, cover_image, read_time, featured, published, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to create article:", error);
        throw new Response(
            JSON.stringify({
                error: "ArticleCreateFailed",
                message:
                    error.code === "23505"
                        ? "An article with this slug already exists."
                        : "Unable to create article.",
            }),
            {
                status: error.code === "23505" ? 409 : 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return data as ArticleRecord;
}

export async function updateArticle(
    input: UpdateArticleInput & { author_avatar_url?: string | null },
    userId: string
): Promise<ArticleRecord> {
    const supabase = getSupabaseAdminClient();
    const role = await getUserRole(userId);

    const { data: existing, error: existingError } = await supabase
        .from("articles")
        .select("id, created_by")
        .eq("id", input.id)
        .maybeSingle();

    if (existingError || !existing) {
        throw new Response(
            JSON.stringify({
                error: "ArticleNotFound",
                message: "Article could not be found for update.",
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    if (existing.created_by !== userId && !["admin", "editor"].includes(role ?? "")) {
        throw new Response(
            JSON.stringify({
                error: "Forbidden",
                message: "You do not have permission to update this article.",
            }),
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const { data, error } = await supabase
        .from("articles")
        .update({
            slug: input.slug,
            title: input.title,
            excerpt: input.excerpt || null,
            body: input.body,
            category: input.category || "General",
            author_name: input.author_name || null,
            author_avatar_url: input.author_avatar_url || null,
            cover_image: input.cover_image || null,
            read_time: input.read_time || null,
            featured: input.featured ?? false,
            published: input.published ?? false,
        })
        .eq("id", input.id)
        .select(
            "id, slug, title, excerpt, body, category, author_name, author_avatar_url, cover_image, read_time, featured, published, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error(`Failed to update article "${input.id}":`, error);
        throw new Response(
            JSON.stringify({
                error: "ArticleUpdateFailed",
                message:
                    error.code === "23505"
                        ? "An article with this slug already exists."
                        : "Unable to update article.",
            }),
            {
                status: error.code === "23505" ? 409 : 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return data as ArticleRecord;
}