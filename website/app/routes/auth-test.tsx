import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { GitHubLoginButton } from "~/components/auth/GitHubLoginButton/GitHubLoginButton";
import { SignOutButton } from "~/components/auth/SignOutButton/SignOutButton";
import { supabase } from "~/lib/supabase/browser";

export default function AuthTestRoute() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadSession() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (mounted) {
                setUser(user ?? null);
                setLoading(false);
            }
        }

        void loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (mounted) {
                setUser(user ?? null);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div style={{ padding: 40 }}>
            <h1>Auth Test</h1>

            {loading && <p>Checking session...</p>}

            {!loading && !user && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p>No user session found.</p>
                    <GitHubLoginButton />
                </div>
            )}

            {!loading && user && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p>Signed in successfully.</p>
                    <p>
                        <strong>User ID:</strong> {user.id}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email ?? "No email"}
                    </p>
                    <SignOutButton />
                </div>
            )}
        </div>
    );
}