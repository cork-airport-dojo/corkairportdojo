import { data } from "react-router";
import {
    createModuleSchema,
    updateModuleSchema,
} from "~/lib/api/module-schema.server";
import {
    createModule,
    deleteModule,
    updateModule,
} from "~/lib/api/modules.server";
import { requireRequestUser } from "~/lib/supabase/auth.server";

export async function action({ request }: { request: Request }) {
    const method = request.method.toUpperCase();
    const { user, responseHeaders } = await requireRequestUser(request);

    let json: unknown = null;

    if (method !== "DELETE") {
        try {
            json = await request.json();
        } catch {
            return new Response(
                JSON.stringify({
                    error: "InvalidJson",
                    message: "Request body must be valid JSON.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...Object.fromEntries(responseHeaders.entries()),
                    },
                }
            );
        }
    }

    if (method === "POST") {
        const parsed = createModuleSchema.safeParse(json);

        if (!parsed.success) {
            return new Response(
                JSON.stringify({
                    error: "ValidationFailed",
                    message: "The module payload is invalid.",
                    issues: parsed.error.flatten(),
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...Object.fromEntries(responseHeaders.entries()),
                    },
                }
            );
        }

        const module = await createModule(parsed.data, user.id);

        return new Response(JSON.stringify({ module }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                ...Object.fromEntries(responseHeaders.entries()),
            },
        });
    }

    if (method === "PATCH") {
        const parsed = updateModuleSchema.safeParse(json);

        if (!parsed.success) {
            return new Response(
                JSON.stringify({
                    error: "ValidationFailed",
                    message: "The module update payload is invalid.",
                    issues: parsed.error.flatten(),
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...Object.fromEntries(responseHeaders.entries()),
                    },
                }
            );
        }

        const module = await updateModule(parsed.data, user.id);

        return new Response(JSON.stringify({ module }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...Object.fromEntries(responseHeaders.entries()),
            },
        });
    }

    if (method === "DELETE") {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new Response(
                JSON.stringify({
                    error: "ValidationFailed",
                    message: "Module id is required for deletion.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...Object.fromEntries(responseHeaders.entries()),
                    },
                }
            );
        }

        await deleteModule(id, user.id);

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...Object.fromEntries(responseHeaders.entries()),
            },
        });
    }

    return data(
        {
            error: "MethodNotAllowed",
            message: "Only POST, PATCH, and DELETE are allowed.",
        },
        { status: 405 }
    );
}