import { AppShell } from "~/components/layout/AppShell/AppShell";
import { AuthGuard } from "~/components/auth/AuthGuard/AuthGuard";
import { ProfilePage } from "~/components/profile/ProfilePage/ProfilePage";

export default function ProfileRoute() {
    return (
        <AuthGuard>
            <AppShell >
                <ProfilePage />
            </AppShell>
        </AuthGuard>
    );
}