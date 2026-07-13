import { FiGithub } from "react-icons/fi";
import { useAuthStore } from "~/store/use-auth-store";

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
    const { signInWithGitHub } = useAuthStore();

    const handleLogin = async () => {
        await signInWithGitHub(redirectTo);
    };

    return (
        <button
            type="button"
            onClick={() => void handleLogin()}
            className={className}
            title={title}
            aria-label={title || label}
        >
            <FiGithub size={18} />
            {!iconOnly && <span>{label}</span>}
        </button>
    );
}