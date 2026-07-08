import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ArticlesPage } from "~/components/articles/ArticlesPage/ArticlesPage";

export default function BlogRoute() {
    return (
        <AppShell hideDefaultRightSidebar>
            <ArticlesPage />
        </AppShell>
    );
}