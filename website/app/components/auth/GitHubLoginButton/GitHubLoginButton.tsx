import { FiGithub } from "react-icons/fi";
import { useMemo } from "react";
import { supabase } from "~/lib/supabase/browser";

interface GitHubLoginButtonProps {
    redirectTo?: string;
    className?: string;
    label?: string;
    iconOnly?: boolean;
    title?: string;
}

export function GitHubLoginButton({
                                      redirectTo = "/profile",
                                      className,
                                      label = "Sign in with GitHub",
                                      iconOnly = false,
                                      title,
                                  }: GitHubLoginButtonProps) {
    const callbackUrl = useMemo(() => {
        const url = new URL("http://localhost:5173/auth/callback");
        url.searchParams.set("next", redirectTo);
        return url.toString();
    }, [redirectTo]);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: callbackUrl,
            },
        });

        if (error) {
            console.error("GitHub OAuth error:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={() => void handleLogin()}
            className={className}
            title={title}
            aria-label={title || label}
        >
            <FiGithub size={16} />
            {!iconOnly && <span>{label}</span>}
        </button>
    );
}