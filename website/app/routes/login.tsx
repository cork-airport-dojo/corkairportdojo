import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useAuthStore } from "~/store/use-auth-store";

export default function LoginRoute() {
    const [searchParams] = useSearchParams();
    const { isAuthenticated, isLoading, hydrate } = useAuthStore();

    const redirectTo = useMemo(() => {
        return searchParams.get("redirectTo") || "/profile";
    }, [searchParams]);

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    useEffect(() => {
        async function startLogin() {
            if (!isLoading && !isAuthenticated) {
                const { supabase } = await import("~/lib/supabase/browser");

                const callbackUrl = new URL("http://localhost:5173/auth/callback");
                callbackUrl.searchParams.set("next", redirectTo);

                const { error } = await supabase.auth.signInWithOAuth({
                    provider: "github",
                    options: {
                        redirectTo: callbackUrl.toString(),
                    },
                });

                if (error) {
                    console.error("GitHub OAuth error:", error);
                }
            }
        }

        void startLogin();
    }, [isAuthenticated, isLoading, redirectTo]);

    return null;
}