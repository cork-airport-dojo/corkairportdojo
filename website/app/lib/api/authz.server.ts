import { getSupabaseAdminClient } from "~/lib/supabase/server";

export type AppUserRole = "admin" | "editor" | "viewer";

export async function getUserRole(userId: string): Promise<AppUserRole | null> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error(`Failed to load role for user "${userId}":`, error);
        return null;
    }

    return (data?.role as AppUserRole | undefined) ?? null;
}

export async function requireUserRole(
    userId: string,
    allowedRoles: AppUserRole[]
): Promise<AppUserRole> {
    const role = await getUserRole(userId);

    console.log("requireUserRole allowed roles:", allowedRoles);
    console.log("requireUserRole actual role:", role);

    if (!role || !allowedRoles.includes(role)) {
        throw new Response(
            JSON.stringify({
                error: "Forbidden",
                message: "You do not have permission to perform this action.",
            }),
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return role;
}