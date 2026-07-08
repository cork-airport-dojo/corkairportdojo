import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "~/store/use-auth-store";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, hydrate } = useAuthStore();

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const redirectTo = encodeURIComponent(
                `${location.pathname}${location.search}${location.hash}`
            );
            navigate(`/login?redirectTo=${redirectTo}`, { replace: true });
        }
    }, [
        isAuthenticated,
        isLoading,
        location.pathname,
        location.search,
        location.hash,
        navigate,
    ]);

    if (isLoading || !isAuthenticated) return null;

    return <>{children}</>;
}