import { getSupabaseServerClient } from "~/lib/supabase/server";

export async function loader() {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from("modules")
        .select(
            "id, slug, title, description, topic, difficulty, lessons, featured, published, views, overview, created_at, updated_at"
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load published modules:", error);

        return new Response(
            JSON.stringify({
                error: "ModulesLoadFailed",
                message: "Unable to load modules.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return new Response(
        JSON.stringify({
            modules: data ?? [],
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}