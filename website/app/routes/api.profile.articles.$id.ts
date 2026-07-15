import { getUserRole } from "~/lib/api/authz.server";
import { getSupabaseAdminClient } from "~/lib/supabase/server";
import { requireRequestUser } from "~/lib/supabase/auth.server";

interface UpdateArticlePayload {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    category?: string | null;
    author_name?: string | null;
    author_avatar_url?: string | null;
    cover_image?: string | null;
    read_time?: string | null;
    resource_ids?: string[];
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

async function getExistingArticle(articleId: string) {
    const supabase = getSupabaseAdminClient();

    return supabase
        .from("articles")
        .select(
            "id, slug, title, excerpt, category, author_name, author_avatar_url, cover_image, read_time, featured, published, body, created_by, created_at, updated_at"
        )
        .eq("id", articleId)
        .maybeSingle();
}

async function getArticleResourceIds(articleId: string) {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("article_resources")
        .select("resource_id")
        .eq("article_id", articleId);

    if (error) {
        console.error(`Failed to load article resources for "${articleId}":`, error);
        return [];
    }

    return (data ?? [])
        .map((row) => row.resource_id)
        .filter(Boolean) as string[];
}

async function syncArticleResourceIds(articleId: string, resourceIds: string[]) {
    const supabase = getSupabaseAdminClient();

    const { error: deleteLinksError } = await supabase
        .from("article_resources")
        .delete()
        .eq("article_id", articleId);

    if (deleteLinksError) {
        throw deleteLinksError;
    }

    if (!resourceIds.length) return;

    const { error: insertLinksError } = await supabase
        .from("article_resources")
        .insert(
            resourceIds.map((resourceId) => ({
                article_id: articleId,
                resource_id: resourceId,
            }))
        );

    if (insertLinksError) {
        throw insertLinksError;
    }
}

export async function loader({
                                 request,
                                 params,
                             }: {
    request: Request;
    params: { id?: string };
}) {
    const articleId = params.id?.trim();

    if (!articleId) {
        return jsonResponse(
            {
                error: "InvalidArticleId",
                message: "Article id is required.",
            },
            { status: 400 }
        );
    }

    const { user, responseHeaders } = await requireRequestUser(request);
    const role = await getUserRole(user.id);

    const { data: article, error } = await getExistingArticle(articleId);

    if (error || !article) {
        return jsonResponse(
            {
                error: "ArticleNotFound",
                message: "Article could not be found.",
            },
            { status: 404 },
            responseHeaders
        );
    }

    const isAdmin = role === "admin";
    const isEditor = role === "editor";
    const isOwner = article.created_by === user.id;

    if (!isAdmin && !isEditor && !isOwner) {
        return jsonResponse(
            {
                error: "Forbidden",
                message: "You do not have permission to view this article.",
            },
            { status: 403 },
            responseHeaders
        );
    }

    const resource_ids = await getArticleResourceIds(articleId);

    return jsonResponse(
        {
            article: {
                ...article,
                resource_ids,
            },
        },
        { status: 200 },
        responseHeaders
    );
}

export async function action({
                                 request,
                                 params,
                             }: {
    request: Request;
    params: { id?: string };
}) {
    const articleId = params.id?.trim();

    if (!articleId) {
        return jsonResponse(
            {
                error: "InvalidArticleId",
                message: "Article id is required.",
            },
            { status: 400 }
        );
    }

    const method = request.method.toUpperCase();

    if (method === "DELETE") {
        const { user, responseHeaders } = await requireRequestUser(request);
        const role = await getUserRole(user.id);

        const { data: existing, error: existingError } = await getExistingArticle(articleId);

        if (existingError || !existing) {
            return jsonResponse(
                {
                    error: "ArticleNotFound",
                    message: "Article could not be found.",
                },
                { status: 404 },
                responseHeaders
            );
        }

        const isAdmin = role === "admin";
        const isEditor = role === "editor";
        const isOwner = existing.created_by === user.id;

        if (!isAdmin && !isEditor && !isOwner) {
            return jsonResponse(
                {
                    error: "Forbidden",
                    message: "You do not have permission to delete this article.",
                },
                { status: 403 },
                responseHeaders
            );
        }

        const supabase = getSupabaseAdminClient();

        const { error } = await supabase
            .from("articles")
            .delete()
            .eq("id", articleId);

        if (error) {
            console.error(`Failed to delete article "${articleId}":`, error);

            return jsonResponse(
                {
                    error: "ArticleDeleteFailed",
                    message: "Unable to delete article.",
                },
                { status: 500 },
                responseHeaders
            );
        }

        return jsonResponse(
            {
                ok: true,
            },
            { status: 200 },
            responseHeaders
        );
    }

    if (method === "PATCH") {
        const { user, responseHeaders } = await requireRequestUser(request);
        const role = await getUserRole(user.id);

        const { data: existing, error: existingError } = await getExistingArticle(articleId);

        if (existingError || !existing) {
            console.error(`Failed to find article "${articleId}" for update:`, existingError);

            return jsonResponse(
                {
                    error: "ArticleNotFound",
                    message: "Article could not be found.",
                },
                { status: 404 },
                responseHeaders
            );
        }

        const isAdmin = role === "admin";
        const isEditor = role === "editor";
        const isOwner = existing.created_by === user.id;

        if (!isAdmin && !isEditor && !isOwner) {
            return jsonResponse(
                {
                    error: "Forbidden",
                    message: "You do not have permission to update this article.",
                },
                { status: 403 },
                responseHeaders
            );
        }

        let payload: UpdateArticlePayload;

        try {
            payload = (await request.json()) as UpdateArticlePayload;
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
        const resource_ids = Array.isArray(payload.resource_ids)
            ? payload.resource_ids.map((id) => id.trim()).filter(Boolean)
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
            .update({
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
            })
            .eq("id", articleId)
            .select(
                "id, slug, title, excerpt, category, author_name, author_avatar_url, cover_image, read_time, featured, published, body, created_by, created_at, updated_at"
            )
            .single();

        if (error) {
            console.error(`Failed to update article "${articleId}":`, error);

            return jsonResponse(
                {
                    error: "ArticleUpdateFailed",
                    message:
                        error.code === "23505"
                            ? "An article with this slug already exists."
                            : "Unable to update article.",
                },
                { status: error.code === "23505" ? 409 : 500 },
                responseHeaders
            );
        }

        try {
            await syncArticleResourceIds(articleId, resource_ids);
        } catch (resourceError) {
            console.error(
                `Failed to sync article resources for "${articleId}":`,
                resourceError
            );

            return jsonResponse(
                {
                    error: "ArticleResourcesUpdateFailed",
                    message: "Unable to update linked resources.",
                },
                { status: 500 },
                responseHeaders
            );
        }

        return jsonResponse(
            {
                article: {
                    ...data,
                    resource_ids,
                },
            },
            { status: 200 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            error: "MethodNotAllowed",
            message: "Only GET, PATCH and DELETE are allowed for this endpoint.",
        },
        { status: 405 }
    );
}