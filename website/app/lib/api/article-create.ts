export interface CreateArticleRequest {
    slug: string;
    title: string;
    excerpt: string;
    body: string[];
    category: string;
    author_name: string;
    cover_image: string;
    read_time: string;
    featured?: boolean;
    published: boolean;
}

export interface UpdateArticleRequest extends CreateArticleRequest {
    id: string;
}

export interface ArticleMutationResponse {
    article: {
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
    };
}

async function handleResponse(response: Response) {
    const payload = (await response.json()) as
        | ArticleMutationResponse
        | { message?: string };

    if (!response.ok) {
        throw new Error(payload?.message || "Article request failed.");
    }

    return (payload as ArticleMutationResponse).article;
}

export async function createArticleRequest(input: CreateArticleRequest) {
    const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
    });

    return handleResponse(response);
}

export async function updateArticleRequest(input: UpdateArticleRequest) {
    const response = await fetch("/api/articles", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
    });

    return handleResponse(response);
}