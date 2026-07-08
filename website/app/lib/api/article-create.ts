import type { CreateArticleInput } from "~/lib/api/article-schema.server";
import type { PublicArticle } from "~/lib/api/articles";

export async function postArticle(input: CreateArticleInput): Promise<PublicArticle> {
    const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload?.message ?? "Failed to create article.");
    }

    return payload.article as PublicArticle;
}