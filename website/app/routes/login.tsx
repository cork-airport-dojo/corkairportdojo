import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import {   FiGithub } from "react-icons/fi";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./login.module.scss";

export default function LoginRoute() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, isLoading, hydrate, signInWithGitHub } = useAuthStore();

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    const redirectTo = useMemo(() => {
        return searchParams.get("redirectTo") || "/profile";
    }, [searchParams]);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, redirectTo]);

    const handleGitHubLogin = async () => {
        await signInWithGitHub(redirectTo);
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.topBar}>
                    <Button asChild variant="ghost" className={styles.backButton}>
                        <Link to="/">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className={styles.header}>
                    <div className={styles.iconWrap}>
                        <ShieldCheck size={18} />
                    </div>

                    <div className={styles.headerText}>
                        <span className={styles.eyebrow}>Authentication</span>
                        <h1>Sign in to CorkAirportDojo</h1>
                        <p>
                            Continue with GitHub to access protected areas like your
                            profile and article writing features.
                        </p>
                    </div>
                </div>

                <div className={styles.form}>
                    <div className={styles.redirectHint}>
                        After login, you will return to:
                        <code>{redirectTo}</code>
                    </div>

                    <Button
                        type="button"
                        className={styles.submitButton}
                        onClick={() => void handleGitHubLogin()}
                        disabled={isLoading}
                    >
                        <FiGithub size={16} />
                        {isLoading ? "Checking session..." : "Sign in with GitHub"}
                    </Button>
                </div>
            </div>
        </div>
    );
}