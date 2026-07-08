import { data } from "react-router";
import { getPublishedArticleBySlug } from "~/lib/api/articles.server";

interface LoaderArgs {
    params: {
        slug?: string;
    };
}

export async function loader({ params }: LoaderArgs) {
    const slug = params.slug;

    if (!slug) {
        return data({ article: null }, { status: 400 });
    }

    const article = await getPublishedArticleBySlug(slug);

    if (!article) {
        return data({ article: null }, { status: 404 });
    }

    return data({ article });
}