import { supabase } from "~/lib/supabase/browser";

export interface CreateArticleRequest {
    slug: string;
    title: string;
    excerpt: string;
    markdown: string;
    author_name: string;
    author_avatar_url?: string;
    cover_image: string;
    read_time: string;
    resource_ids?: string[];
    featured?: boolean;
    published: boolean;
    module?: string | null;
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
        author_name: string | null;
        author_avatar_url: string | null;
        cover_image: string | null;
        read_time: string | null;
        featured: boolean;
        published: boolean;
        body: string[];
        created_at: string;
        updated_at: string;
    };
}

export async function createArticleRequest(input: CreateArticleRequest): Promise<ArticleMutationResponse["article"]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { resource_ids, module, ...fields } = input;

    const { data, error } = await supabase
        .from("articles")
        .insert({ ...fields, module: module ?? null, created_by: user.id })
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (resource_ids?.length) {
        await syncArticleResources(data.id, resource_ids);
    }

    return data;
}

export async function updateArticleRequest(input: UpdateArticleRequest): Promise<ArticleMutationResponse["article"]> {
    const { id, resource_ids, module, ...fields } = input;

    const { data, error } = await supabase
        .from("articles")
        .update({ ...fields, module: module ?? null })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (resource_ids !== undefined) {
        await syncArticleResources(id, resource_ids);
    }

    return data;
}

async function syncArticleResources(articleId: string, resourceIds: string[]) {
    await supabase.from("article_resources").delete().eq("article_id", articleId);
    if (resourceIds.length === 0) return;
    const rows = resourceIds.map((resource_id) => ({ article_id: articleId, resource_id }));
    const { error } = await supabase.from("article_resources").insert(rows);
    if (error) throw new Error(error.message);
}
