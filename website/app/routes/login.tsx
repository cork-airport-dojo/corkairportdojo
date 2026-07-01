import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./login.module.scss";

export default function LoginRoute() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        isAuthenticated,
        login,
        hydrate,
        consumeAuthMessage,
    } = useAuthStore();

    const [name, setName] = useState("Chris Murphy");
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        hydrate();
        const message = consumeAuthMessage();
        if (message) {
            setNotice(message);
        }
    }, [hydrate, consumeAuthMessage]);

    const redirectTo = useMemo(() => {
        return searchParams.get("redirectTo") || "/";
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectTo]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(name.trim() || "Chris Murphy");
        navigate(redirectTo, { replace: true });
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

                {notice && <div className={styles.notice}>{notice}</div>}

                <div className={styles.header}>
                    <div className={styles.iconWrap}>
                        <ShieldCheck size={18} />
                    </div>

                    <div className={styles.headerText}>
                        <span className={styles.eyebrow}>Authentication</span>
                        <h1>Sign in to CorkAirportDojo</h1>
                        <p>
                            You need to log in to access protected pages like your profile and the write editor.
                        </p>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="name">Display Name</label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className={styles.redirectHint}>
                        After login, you will return to:
                        <code>{redirectTo}</code>
                    </div>

                    <Button type="submit" className={styles.submitButton}>
                        <LogIn size={16} />
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}