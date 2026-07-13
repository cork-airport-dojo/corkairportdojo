import { data } from "react-router";
import { getPublishedArticleBySlug } from "~/lib/api/articles.server";

export async function loader({ params }: { params: { slug?: string } }) {
    const slug = params.slug;

    if (!slug) {
        return data(
            {
                error: "ValidationFailed",
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
                message: "Article could not be found.",
            },
            { status: 404 }
        );
    }

    return data({ article });
}