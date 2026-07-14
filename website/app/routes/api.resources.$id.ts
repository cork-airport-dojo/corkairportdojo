import { requireRequestUser } from "~/lib/supabase/auth.server";
import { deleteResource } from "~/lib/api/resource-server";

function jsonResponse(body: unknown, init?: ResponseInit, extraHeaders?: Headers) {
    return new Response(JSON.stringify(body), {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(extraHeaders ? Object.fromEntries(extraHeaders.entries()) : {}),
            ...(init?.headers ?? {}),
        },
    });
}

export async function action({
                                 request,
                                 params,
                             }: {
    request: Request;
    params: { id?: string };
}) {
    const method = request.method.toUpperCase();
    const resourceId = params.id;

    if (!resourceId) {
        return jsonResponse(
            {
                error: "ValidationFailed",
                message: "Resource id is required.",
            },
            { status: 400 }
        );
    }

    if (method !== "DELETE") {
        return jsonResponse(
            {
                error: "MethodNotAllowed",
                message: "Only DELETE is allowed for this endpoint.",
            },
            { status: 405 }
        );
    }

    const { user, responseHeaders } = await requireRequestUser(request);
    await deleteResource(resourceId, user.id);

    return jsonResponse(
        { ok: true },
        { status: 200 },
        responseHeaders
    );
}