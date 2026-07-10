import { redirect } from "react-router";
import { createRequestSupabaseServerClient } from "~/lib/supabase/auth.server";

export async function loader({ request }: { request: Request }) {
    const { supabase, responseHeaders } = createRequestSupabaseServerClient(request);

    await supabase.auth.signOut();

    return redirect("/", {
        headers: responseHeaders,
    });
}

export default function LogoutRoute() {
    return null;
}