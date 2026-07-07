import { useParams } from "react-router";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ArticlePage } from "~/components/blog/ArticlePage/ArticlePage";
import { posts } from "~/lib/constants/posts";

export default function BlogPostRoute() {
    const { postId } = useParams();

    const post = posts.find((item) => item.id === postId);

    if (!post) {
        return (
            <AppShell hideDefaultRightSidebar>
                <div style={{ paddingBottom: "100px" }}>
                    <h1>Article not found</h1>
                    <p>The article you are looking for does not exist.</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell hideDefaultRightSidebar>
            <ArticlePage post={post} />
        </AppShell>
    );
}