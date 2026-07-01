import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "~/store/use-auth-store";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, hydrate } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!isAuthenticated) {
            const redirectTo = encodeURIComponent(
                `${location.pathname}${location.search}${location.hash}`
            );
            navigate(`/login?redirectTo=${redirectTo}`, { replace: true });
        }
    }, [isAuthenticated, location.pathname, location.search, location.hash, navigate]);

    if (!isAuthenticated) return null;

    return <>{children}</>;
}