import { redirect } from "react-router";
import { createRequestSupabaseServerClient } from "~/lib/supabase/auth.server";

export async function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/profile";

    if (!code) {
        return redirect("/");
    }

    const { supabase, responseHeaders } = createRequestSupabaseServerClient(request);

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error("OAuth callback exchange failed:", error);
        return redirect("/", {
            headers: responseHeaders,
        });
    }

    return redirect(next, {
        headers: responseHeaders,
    });
}

export default function AuthCallbackRoute() {
    return null;
}