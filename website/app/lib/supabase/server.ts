import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "~/lib/supabase/env.server";

export function getSupabaseServerClient() {
    const { supabaseUrl, supabasePublishableKey } = getSupabaseServerEnv();

    return createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}

export function getSupabaseAdminClient() {
    const { supabaseUrl, supabaseSecretKey } = getSupabaseServerEnv();

    return createClient(supabaseUrl, supabaseSecretKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}