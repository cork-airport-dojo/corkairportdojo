import { data } from "react-router";
import {
    createResourceSchema,
    updateResourceSchema,
} from "~/lib/api/resource-schema.server";
import { requireUserRole } from "~/lib/api/authz.server";
import {
    createResource,
    getResources,
    updateResource,
} from "~/lib/api/resource-server";
import { requireRequestUser } from "~/lib/supabase/auth.server";

export async function loader() {
    const resources = await getResources();
    return data({ resources });
}

export async function action({ request }: { request: Request }) {
    const method = request.method.toUpperCase();

    if (method !== "POST" && method !== "PATCH") {
        return data(
            {
                error: "MethodNotAllowed",
                message: "Only POST and PATCH are allowed for this endpoint.",
            },
            { status: 405 }
        );
    }

    const { user, responseHeaders } = await requireRequestUser(request);
    await requireUserRole(user.id, ["admin", "editor"]);

    let json: unknown;

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

    if (method === "POST") {
        const parsed = createResourceSchema.safeParse(json);

        if (!parsed.success) {
            return new Response(
                JSON.stringify({
                    error: "ValidationFailed",
                    message: "The resource payload is invalid.",
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

        const resource = await createResource(parsed.data, user.id);

        return new Response(JSON.stringify({ resource }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                ...Object.fromEntries(responseHeaders.entries()),
            },
        });
    }

    const parsed = updateResourceSchema.safeParse(json);

    if (!parsed.success) {
        return new Response(
            JSON.stringify({
                error: "ValidationFailed",
                message: "The resource update payload is invalid.",
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

    const resource = await updateResource(parsed.data, user.id);

    return new Response(JSON.stringify({ resource }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            ...Object.fromEntries(responseHeaders.entries()),
        },
    });
}