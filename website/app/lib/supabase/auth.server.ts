import {
    createServerClient,
    parseCookieHeader,
    serializeCookieHeader,
} from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "~/lib/supabase/env.server";

export function createRequestSupabaseServerClient(request: Request) {
    const { supabaseUrl, supabasePublishableKey } = getSupabaseServerEnv();
    const responseHeaders = new Headers();

    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            getAll() {
                return parseCookieHeader(request.headers.get("Cookie") ?? "");
            },
            setAll(cookies) {
                for (const cookie of cookies) {
                    const serialized = serializeCookieHeader(
                        cookie.name,
                        cookie.value,
                        cookie.options
                    );
                    responseHeaders.append("Set-Cookie", serialized);
                }
            },
        },
    });

    return { supabase, responseHeaders };
}

export async function getRequestUser(
    request: Request
): Promise<{ user: User | null; responseHeaders: Headers }> {
    const { supabase, responseHeaders } = createRequestSupabaseServerClient(request);

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    console.log("SSR authenticated user id:", user?.id);
    console.log("SSR authenticated user email:", user?.email);

    if (error) {
        console.error("Failed to get request user from cookie session:", error);
        return { user: null, responseHeaders };
    }

    return { user, responseHeaders };
}

export async function requireRequestUser(
    request: Request
): Promise<{ user: User; responseHeaders: Headers }> {
    const { user, responseHeaders } = await getRequestUser(request);

    if (!user) {
        throw new Response(
            JSON.stringify({
                error: "Unauthorized",
                message: "You must be signed in to perform this action.",
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    ...Object.fromEntries(responseHeaders.entries()),
                },
            }
        );
    }

    return { user, responseHeaders };
}