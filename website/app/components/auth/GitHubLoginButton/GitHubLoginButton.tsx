import {   FiGithub } from "react-icons/fi";
import { supabase } from "~/lib/supabase/browser";

interface GitHubLoginButtonProps {
    redirectTo?: string;
    className?: string;
}

export function GitHubLoginButton({
                                      redirectTo = "http://localhost:5173/auth/callback",
                                      className,
                                  }: GitHubLoginButtonProps) {
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo,
            },
        });

        if (error) {
            console.error("GitHub OAuth error:", error);
        }
    };

    return (
        <button type="button" onClick={() => void handleLogin()} className={className}>
            <FiGithub size={16} />
            <span>Continue with GitHub</span>
        </button>
    );
}