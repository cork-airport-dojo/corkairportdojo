import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "~/lib/supabase/browser";

export default function AuthCallbackRoute() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Supabase automatically exchanges the code in the URL for a session.
        // We just wait for the SIGNED_IN event then redirect.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_IN") {
                subscription.unsubscribe();
                navigate(searchParams.get("next") ?? "/profile", { replace: true });
            }
        });

        // Fallback: if no event fires within 5 s, try navigating anyway.
        const timeout = setTimeout(() => {
            subscription.unsubscribe();
            navigate(searchParams.get("next") ?? "/profile", { replace: true });
        }, 5000);

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    return <p>Signing in…</p>;
}
