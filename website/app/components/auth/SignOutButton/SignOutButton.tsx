import { supabase } from "~/lib/supabase/browser";

interface SignOutButtonProps {
    className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Sign out failed:", error);
            return;
        }

        window.location.href = "/login";
    };

    return (
        <button type="button" onClick={() => void handleSignOut()} className={className}>
            Sign out
        </button>
    );
}