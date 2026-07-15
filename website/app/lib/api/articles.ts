export interface PublicArticleResource {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
}

export interface PublicArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string[];
    category: string | null;
    author_name: string | null;
    author_avatar_url: string | null;
    cover_image: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    created_at: string;
    updated_at: string;
    resources?: PublicArticleResource[];
}

export async function fetchArticles(): Promise<PublicArticle[]> {
    const response = await fetch("/api/articles", {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch articles");
    }

    const payload = (await response.json()) as { articles?: PublicArticle[] };
    return payload.articles ?? [];
}

export async function fetchArticleBySlug(
    slug: string
): Promise<PublicArticle | null> {
    const response = await fetch(`/api/articles/${slug}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch article");
    }

    const payload = (await response.json()) as { article?: PublicArticle | null };
    return payload.article ?? null;
}