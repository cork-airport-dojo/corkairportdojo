import { AuthGuard } from "~/components/auth/AuthGuard/AuthGuard";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ArticlesPage } from "~/components/articles/ArticlesPage/ArticlesPage";

export default function EditArticleRoute() {
    return (
        <AuthGuard>
            <AppShell hideDefaultRightSidebar>
                <ArticlesPage />
            </AppShell>
        </AuthGuard>
    );
}