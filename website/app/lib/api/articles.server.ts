import { getSupabaseAdminClient, getSupabaseServerClient } from "~/lib/supabase/server";
import type {
    CreateArticleInput,
    UpdateArticleInput,
} from "~/lib/api/article-schema.server";

export interface ArticleRecord {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    author_name: string | null;
    cover_image: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    body: string[];
    created_at: string;
    updated_at: string;
}

export async function getPublishedArticles(): Promise<ArticleRecord[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("articles")
        .select(
            "id, slug, title, excerpt, category, author_name, cover_image, read_time, featured, published, body, created_at, updated_at"
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
            "id, slug, title, excerpt, category, author_name, cover_image, read_time, featured, published, body, created_at, updated_at"
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
    input: CreateArticleInput,
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
            cover_image: input.cover_image || null,
            read_time: input.read_time || null,
            featured: input.featured ?? false,
            published: input.published ?? false,
            created_by: createdBy,
        })
        .select(
            "id, slug, title, excerpt, category, author_name, cover_image, read_time, featured, published, body, created_at, updated_at"
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
    input: UpdateArticleInput,
    userId: string
): Promise<ArticleRecord> {
    const supabase = getSupabaseAdminClient();

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

    if (existing.created_by !== userId) {
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
            cover_image: input.cover_image || null,
            read_time: input.read_time || null,
            featured: input.featured ?? false,
            published: input.published ?? false,
        })
        .eq("id", input.id)
        .select(
            "id, slug, title, excerpt, category, author_name, cover_image, read_time, featured, published, body, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to update article:", error);
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