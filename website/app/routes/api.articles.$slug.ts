import { data } from "react-router";
import { getPublishedArticleBySlug } from "~/lib/api/articles.server";

export async function loader({ params }: { params: { slug?: string } }) {
    const slug = params.slug?.trim();

    if (!slug) {
        return data(
            {
                error: "InvalidSlug",
                message: "Article slug is required.",
            },
            { status: 400 }
        );
    }

    const article = await getPublishedArticleBySlug(slug);

    if (!article) {
        return data(
            {
                error: "ArticleNotFound",
                message: "Article not found.",
            },
            { status: 404 }
        );
    }

    return data({ article });
}