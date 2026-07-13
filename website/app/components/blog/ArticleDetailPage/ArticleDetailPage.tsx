import { useEffect, useState } from "react";
import { AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ArticlePage, type ArticlePagePost } from "~/components/blog/ArticlePage/ArticlePage";
import { fetchArticleBySlug } from "~/lib/api/articles";
import styles from "./ArticleDetailPage.module.scss";

interface ArticleDetailPageProps {
    slug: string;
}

function formatPublishedDate(value: string) {
    try {
        return new Intl.DateTimeFormat("en-IE", {
            dateStyle: "medium",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function mapArticleToPagePost(
    article: Awaited<ReturnType<typeof fetchArticleBySlug>>
): ArticlePagePost | null {
    if (!article) return null;

    return {
        id: article.slug,
        title: article.title,
        category: article.category ?? "General",
        excerpt: article.excerpt ?? "",
        author: article.author_name ?? "CorkAirportDojo",
        authorAvatarUrl: article.author_avatar_url ?? null,
        date: formatPublishedDate(article.created_at),
        readTime: article.read_time ?? "Article",
        image: article.cover_image ?? "/logo.png",
        resourceIds: [],
        body: Array.isArray(article.body) ? article.body : [],
        featured: article.featured,
    };
}

function LoadingState() {
    return (
        <div className={styles.stateWrap}>
            <Card className={styles.stateCard}>
                <CardContent className={styles.stateBody}>
                    <div className={styles.skeletonCategory} />
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonExcerpt} />
                    <div className={styles.skeletonMeta} />
                    <div className={styles.skeletonHero} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonTextShort} />
                </CardContent>
            </Card>
        </div>
    );
}

function ErrorState() {
    return (
        <div className={styles.stateWrap}>
            <Card className={styles.stateCard}>
                <CardHeader className={styles.stateHeader}>
                    <div className={styles.iconWrap}>
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <h2>Unable to load article</h2>
                        <p>There was a problem loading this article right now.</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}

function EmptyState() {
    return (
        <div className={styles.stateWrap}>
            <Card className={styles.stateCard}>
                <CardHeader className={styles.stateHeader}>
                    <div className={styles.iconWrap}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <h2>Article not found</h2>
                        <p>The article you are looking for does not exist or is not published.</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}

export function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
    const [post, setPost] = useState<ArticlePagePost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(false);

            try {
                const article = await fetchArticleBySlug(slug);
                setPost(mapArticleToPagePost(article));
            } catch (err) {
                console.error("Failed to load article:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [slug]);

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState />;
    }

    if (!post) {
        return <EmptyState />;
    }

    return <ArticlePage post={post} />;
}