import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "~/store/use-auth-store";

export default function LoginRoute() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasStarted = useRef(false);
    const { isAuthenticated, isLoading, hydrate, signInWithGitHub } = useAuthStore();

    const redirectTo = useMemo(() => {
        return searchParams.get("redirectTo") || "/profile";
    }, [searchParams]);

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (hasStarted.current) return;
        if (isLoading) return;

        if (isAuthenticated) {
            navigate(redirectTo, { replace: true });
            return;
        }

        hasStarted.current = true;
        void signInWithGitHub(redirectTo);
    }, [isAuthenticated, isLoading, navigate, redirectTo, signInWithGitHub]);

    return null;
}