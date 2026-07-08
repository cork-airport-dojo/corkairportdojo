import { data } from "react-router";
import { createArticleSchema } from "~/lib/api/article-schema.server";
import { requireUserRole } from "~/lib/api/authz.server";
import { createArticle, getPublishedArticles } from "~/lib/api/articles.server";
import { requireRequestUser } from "~/lib/supabase/auth.server";

export async function loader() {
    const articles = await getPublishedArticles();
    return data({ articles });
}

export async function action({ request }: { request: Request }) {
    if (request.method.toUpperCase() !== "POST") {
        return data(
            {
                error: "MethodNotAllowed",
                message: "Only POST is allowed for this endpoint.",
            },
            { status: 405 }
        );
    }

    const { user, headers } = await requireRequestUser(request);
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
                    ...Object.fromEntries(headers.entries()),
                },
            }
        );
    }

    const parsed = createArticleSchema.safeParse(json);

    if (!parsed.success) {
        return new Response(
            JSON.stringify({
                error: "ValidationFailed",
                message: "The article payload is invalid.",
                issues: parsed.error.flatten(),
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...Object.fromEntries(headers.entries()),
                },
            }
        );
    }

    const article = await createArticle(parsed.data, user.id);

    return new Response(JSON.stringify({ article }), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
            ...Object.fromEntries(headers.entries()),
        },
    });
}