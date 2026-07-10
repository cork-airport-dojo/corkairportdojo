export function getSupabaseServerEnv() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl) {
        throw new Error("Missing SUPABASE_URL");
    }

    if (!supabasePublishableKey) {
        throw new Error("Missing SUPABASE_PUBLISHABLE_KEY");
    }

    if (!supabaseSecretKey) {
        throw new Error("Missing SUPABASE_SECRET_KEY");
    }

    return {
        supabaseUrl,
        supabasePublishableKey,
        supabaseSecretKey,
    };
}