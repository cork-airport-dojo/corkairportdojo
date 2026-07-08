export interface PublicArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    author_name: string | null;
    cover_image: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    body: string[];
    created_at: string;
    updated_at: string;
}

export async function fetchArticles(): Promise<PublicArticle[]> {
    const response = await fetch("/api/articles");

    if (!response.ok) {
        throw new Error("Failed to fetch articles");
    }

    const payload = (await response.json()) as { articles?: PublicArticle[] };
    return payload.articles ?? [];
}

export async function fetchArticleBySlug(
    slug: string
): Promise<PublicArticle | null> {
    const response = await fetch(`/api/articles/${slug}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch article");
    }

    const payload = (await response.json()) as { article?: PublicArticle | null };
    return payload.article ?? null;
}