import { getUserRole } from "~/lib/api/authz.server";
import { getSupabaseAdminClient } from "~/lib/supabase/server";
import { requireRequestUser } from "~/lib/supabase/auth.server";

interface CreateArticlePayload {
    title: string;
    slug: string;
    excerpt?: string | null;
    category?: string | null;
    author_name?: string | null;
    author_avatar_url?: string | null;
    cover_image?: string | null;
    read_time?: string | null;
    featured?: boolean;
    published?: boolean;
    body?: string[] | null;
}

function jsonResponse(
    body: unknown,
    init?: ResponseInit,
    extraHeaders?: Headers
) {
    return new Response(JSON.stringify(body), {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(extraHeaders ? Object.fromEntries(extraHeaders.entries()) : {}),
            ...(init?.headers ?? {}),
        },
    });
}

export async function loader({ request }: { request: Request }) {
    const { user, responseHeaders } = await requireRequestUser(request);
    const supabase = getSupabaseAdminClient();
    const role = await getUserRole(user.id);

    let query = supabase
        .from("articles")
        .select(
            "id, slug, title, excerpt, category, author_name, author_avatar_url, cover_image, read_time, featured, published, body, created_by, created_at, updated_at"
        )
        .order("updated_at", { ascending: false });

    if (role !== "admin") {
        query = query.eq("created_by", user.id);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Failed to load profile articles:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });

        return jsonResponse(
            {
                error: "ProfileArticlesLoadFailed",
                message: "Unable to load articles.",
            },
            { status: 500 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            articles: data ?? [],
        },
        { status: 200 },
        responseHeaders
    );
}

export async function action({ request }: { request: Request }) {
    const method = request.method.toUpperCase();

    if (method !== "POST") {
        return jsonResponse(
            {
                error: "MethodNotAllowed",
                message: "Only POST is allowed for this endpoint.",
            },
            { status: 405 }
        );
    }

    const { user, responseHeaders } = await requireRequestUser(request);
    const role = await getUserRole(user.id);

    if (role !== "admin" && role !== "editor") {
        return jsonResponse(
            {
                error: "Forbidden",
                message: "You do not have permission to create articles.",
            },
            { status: 403 },
            responseHeaders
        );
    }

    let payload: CreateArticlePayload;

    try {
        payload = (await request.json()) as CreateArticlePayload;
    } catch {
        return jsonResponse(
            {
                error: "InvalidJson",
                message: "Request body must be valid JSON.",
            },
            { status: 400 },
            responseHeaders
        );
    }

    const title = payload.title?.trim();
    const slug = payload.slug?.trim();
    const excerpt = payload.excerpt?.trim() || null;
    const category = payload.category?.trim() || null;
    const author_name = payload.author_name?.trim() || null;
    const author_avatar_url = payload.author_avatar_url?.trim() || null;
    const cover_image = payload.cover_image?.trim() || null;
    const read_time = payload.read_time?.trim() || null;
    const featured = Boolean(payload.featured);
    const published = Boolean(payload.published);
    const body = Array.isArray(payload.body)
        ? payload.body.map((item) => item.trim()).filter(Boolean)
        : [];

    if (!title) {
        return jsonResponse(
            {
                error: "ValidationFailed",
                message: "Title is required.",
            },
            { status: 400 },
            responseHeaders
        );
    }

    if (!slug) {
        return jsonResponse(
            {
                error: "ValidationFailed",
                message: "Slug is required.",
            },
            { status: 400 },
            responseHeaders
        );
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("articles")
        .insert({
            title,
            slug,
            excerpt,
            category,
            author_name,
            author_avatar_url,
            cover_image,
            read_time,
            featured,
            published,
            body,
            created_by: user.id,
        })
        .select(
            "id, slug, title, excerpt, category, author_name, author_avatar_url, cover_image, read_time, featured, published, body, created_by, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to create article:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });

        return jsonResponse(
            {
                error: "ArticleCreateFailed",
                message:
                    error.code === "23505"
                        ? "An article with this slug already exists."
                        : "Unable to create article.",
            },
            { status: error.code === "23505" ? 409 : 500 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            article: data,
        },
        { status: 201 },
        responseHeaders
    );
}