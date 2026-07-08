import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useAuthStore } from "~/store/use-auth-store";

export default function LoginRoute() {
    const [searchParams] = useSearchParams();
    const { isAuthenticated, isLoading, hydrate, signInWithGitHub } = useAuthStore();

    const redirectTo = useMemo(() => {
        return searchParams.get("redirectTo") || "/profile";
    }, [searchParams]);

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            void signInWithGitHub(redirectTo);
        }
    }, [isAuthenticated, isLoading, redirectTo, signInWithGitHub]);

    return null;
}