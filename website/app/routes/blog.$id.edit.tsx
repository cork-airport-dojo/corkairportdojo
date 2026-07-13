import { AuthGuard } from "~/components/auth/AuthGuard/AuthGuard";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { WritePostPage } from "~/components/write/WritePostPage/WritePostPage";

export default function EditArticleRoute() {
    return (
        <AuthGuard>
            <AppShell hideDefaultRightSidebar>
                <WritePostPage />
            </AppShell>
        </AuthGuard>
    );
}