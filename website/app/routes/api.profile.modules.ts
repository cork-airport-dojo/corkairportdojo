import { getUserRole } from "~/lib/api/authz.server";
import { requireRequestUser } from "~/lib/supabase/auth.server";
import { getSupabaseAdminClient } from "~/lib/supabase/server";

type ModuleDifficulty = "Beginner" | "Intermediate" | "Advanced";

interface CreateModulePayload {
    title: string;
    slug: string;
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

export async function loader({ request }: { request: Request }) {
    const { user, responseHeaders } = await requireRequestUser(request);
    const supabase = getSupabaseAdminClient();
    const role = await getUserRole(user.id);

    let query = supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
        )
        .order("updated_at", { ascending: false });

    if (role !== "admin") {
        query = query.eq("created_by", user.id);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Failed to load profile modules:", error);

        return jsonResponse(
            {
                error: "ProfileModulesLoadFailed",
                message: "Unable to load modules.",
            },
            { status: 500 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            modules: data ?? [],
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
                message: "You do not have permission to create modules.",
            },
            { status: 403 },
            responseHeaders
        );
    }

    let payload: CreateModulePayload;

    try {
        payload = (await request.json()) as CreateModulePayload;
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
        .insert({
            title,
            slug,
            description,
            topic,
            lessons,
            difficulty,
            featured,
            published,
            overview,
            created_by: user.id,
        })
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_by, created_at, updated_at"
        )
        .single();

    if (error) {
        console.error("Failed to create module:", error);

        return jsonResponse(
            {
                error: "ModuleCreateFailed",
                message:
                    error.code === "23505"
                        ? "A module with this slug already exists."
                        : "Unable to create module.",
            },
            { status: error.code === "23505" ? 409 : 500 },
            responseHeaders
        );
    }

    return jsonResponse(
        {
            module: data,
        },
        { status: 201 },
        responseHeaders
    );
}