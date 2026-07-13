import { getSupabaseServerClient } from "~/lib/supabase/server";

export async function loader({
                                 params,
                             }: {
    params: { slug?: string };
}) {
    const slug = params.slug;

    if (!slug) {
        return new Response(
            JSON.stringify({
                error: "ValidationFailed",
                message: "Module slug is required.",
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_at, updated_at"
        )
        .eq("published", true)
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        console.error(`Failed to load module for slug "${slug}":`, error);

        return new Response(
            JSON.stringify({
                error: "ModuleLoadFailed",
                message: "Unable to load module.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    if (!data) {
        return new Response(
            JSON.stringify({
                error: "ModuleNotFound",
                message: "Module could not be found.",
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return new Response(
        JSON.stringify({
            module: data,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}