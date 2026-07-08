import { useParams } from "react-router";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ArticleDetailPage } from "~/components/blog/ArticleDetailPage/ArticleDetailPage";

export default function BlogPostRoute() {
    const { postId } = useParams();

    if (!postId) {
        return (
            <AppShell hideDefaultRightSidebar>
                <ArticleDetailPage slug="" />
            </AppShell>
        );
    }

    return (
        <AppShell hideDefaultRightSidebar>
            <ArticleDetailPage slug={postId} />
        </AppShell>
    );
}