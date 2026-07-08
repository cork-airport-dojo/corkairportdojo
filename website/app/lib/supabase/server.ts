import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "./env.server";

export function getSupabaseServerClient() {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseServerEnv();

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
        },
    });
}

export function getSupabaseAdminClient() {
    const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseServerEnv();

    if (!supabaseServiceRoleKey) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}