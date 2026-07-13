import { getUserRole } from "~/lib/api/authz.server";
import { requireRequestUser } from "~/lib/supabase/auth.server";
import { getSupabaseAdminClient } from "~/lib/supabase/server";

type ModuleDifficulty = "Beginner" | "Intermediate" | "Advanced";

interface UpdateModulePayload {
    title?: string;
    slug?: string;
    description?: string | null;
    topic?: string | null;
    lessons?: number;
    difficulty?: ModuleDifficulty;
    featured?: boolean;
    published?: boolean;
    overview?: string[];
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

async function getExistingModule(moduleId: string) {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
        )
        .eq("id", moduleId)
        .maybeSingle();

    return { data, error };
}

export async function loader({
                                 request,
                                 params,
                             }: {
    request: Request;
    params: { id?: string };
}) {
    const moduleId = params.id;

    if (!moduleId) {
        return jsonResponse(
            {
                error: "ValidationFailed",
                message: "Module id is required.",
            },
            { status: 400 }
        );
    }

    const { user, responseHeaders } = await requireRequestUser(request);
    const role = await getUserRole(user.id);

    const { data: existing, error } = await getExistingModule(moduleId);

    if (error || !existing) {
        return jsonResponse(
            {
                error: "ModuleNotFound",
                message: "Module could not be found.",
            },
            { status: 404 },
            responseHeaders
        );
    }

    const isAdmin = role === "admin";
    const isOwner = existing.created_by === user.id;

    if (!isAdmin && !isOwner) {
        return jsonResponse(
            {
                error: "Forbidden",
                message: "You do not have permission to view this module.",
            },
            { status: 403 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            module: existing,
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
    const method = request.method.toUpperCase();

    if (method === "DELETE") {
        const moduleId = params.id;

        if (!moduleId) {
            return jsonResponse(
                {
                    error: "ValidationFailed",
                    message: "Module id is required.",
                },
                { status: 400 }
            );
        }

        const { user, responseHeaders } = await requireRequestUser(request);
        const role = await getUserRole(user.id);

        const { data: existing, error: existingError } = await getExistingModule(moduleId);

        if (existingError || !existing) {
            return jsonResponse(
                {
                    error: "ModuleNotFound",
                    message: "Module could not be found.",
                },
                { status: 404 },
                responseHeaders
            );
        }

        const isAdmin = role === "admin";
        const isOwner = existing.created_by === user.id;

        if (!isAdmin && !isOwner) {
            return jsonResponse(
                {
                    error: "Forbidden",
                    message: "You do not have permission to delete this module.",
                },
                { status: 403 },
                responseHeaders
            );
        }

        const supabase = getSupabaseAdminClient();

        const { error } = await supabase
            .from("modules")
            .delete()
            .eq("id", moduleId);

        if (error) {
            console.error(`Failed to delete module "${moduleId}":`, error);

            return jsonResponse(
                {
                    error: "ModuleDeleteFailed",
                    message: "Unable to delete module.",
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
        const moduleId = params.id;

        if (!moduleId) {
            return jsonResponse(
                {
                    error: "ValidationFailed",
                    message: "Module id is required.",
                },
                { status: 400 }
            );
        }

        const { user, responseHeaders } = await requireRequestUser(request);
        const role = await getUserRole(user.id);

        const { data: existing, error: existingError } = await getExistingModule(moduleId);

        if (existingError || !existing) {
            return jsonResponse(
                {
                    error: "ModuleNotFound",
                    message: "Module could not be found.",
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
                    message: "You do not have permission to update this module.",
                },
                { status: 403 },
                responseHeaders
            );
        }

        let payload: UpdateModulePayload;

        try {
            payload = (await request.json()) as UpdateModulePayload;
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
        const description = payload.description?.trim() || null;
        const topic = payload.topic?.trim() || null;
        const lessons = Number(payload.lessons ?? 0);
        const difficulty = payload.difficulty ?? "Beginner";
        const featured = Boolean(payload.featured);
        const published = Boolean(payload.published);
        const overview = Array.isArray(payload.overview)
            ? payload.overview.map((item) => item.trim()).filter(Boolean)
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

        if (!Number.isFinite(lessons) || lessons < 1) {
            return jsonResponse(
                {
                    error: "ValidationFailed",
                    message: "Lessons must be at least 1.",
                },
                { status: 400 },
                responseHeaders
            );
        }

        const supabase = getSupabaseAdminClient();

        const { data, error } = await supabase
            .from("modules")
            .update({
                title,
                slug,
                description,
                topic,
                lessons,
                difficulty,
                featured,
                published,
                overview,
            })
            .eq("id", moduleId)
            .select(
                "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
            )
            .single();

        if (error) {
            console.error(`Failed to update module "${moduleId}":`, error);

            return jsonResponse(
                {
                    error: "ModuleUpdateFailed",
                    message:
                        error.code === "23505"
                            ? "A module with this slug already exists."
                            : "Unable to update module.",
                },
                { status: error.code === "23505" ? 409 : 500 },
                responseHeaders
            );
        }

        return jsonResponse(
            {
                module: data,
            },
            { status: 200 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            error: "MethodNotAllowed",
            message: "Only GET, PATCH, and DELETE are allowed for this endpoint.",
        },
        { status: 405 }
    );
}