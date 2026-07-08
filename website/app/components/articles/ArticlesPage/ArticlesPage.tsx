import { useEffect, useState } from "react";
import { ArrowRight, FileText, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { fetchArticles, type PublicArticle } from "~/lib/api/articles";
import styles from "./ArticlesPage.module.scss";

function ArticlesLoadingState() {
    return (
        <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className={styles.card}>
                <CardContent className={styles.cardBody}>
                <div className={styles.skeletonCategory} />
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonTitleShort} />
    <div className={styles.skeletonExcerpt} />
    <div className={styles.skeletonExcerptShort} />
    <div className={styles.skeletonFooter} />
    </CardContent>
    </Card>
))}
    </div>
);
}

function ArticlesErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <Card className={styles.stateCard}>
        <CardHeader className={styles.stateHeader}>
        <div className={styles.stateIconWrap}>
        <RefreshCw size={18} />
    </div>
    <div>
    <h2>Unable to load articles</h2>
    <p>There was a problem loading article content right now.</p>
    </div>
    </CardHeader>

    <CardContent className={styles.stateBody}>
    <button type="button" className={styles.retryButton} onClick={onRetry}>
        Try Again
    </button>
    </CardContent>
    </Card>
);
}

function ArticlesEmptyState() {
    return (
        <Card className={styles.stateCard}>
        <CardHeader className={styles.stateHeader}>
        <div className={styles.stateIconWrap}>
        <FileText size={18} />
    </div>
    <div>
    <h2>No articles yet</h2>
    <p>Published articles will appear here once they have been created.</p>
    </div>
    </CardHeader>
    </Card>
);
}

export function ArticlesPage() {
    const [articles, setArticles] = useState<PublicArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadArticles = async () => {
        setLoading(true);
        setError(false);

        try {
            const data = await fetchArticles();
            setArticles(data);
        } catch (err) {
            console.error("Failed to load articles:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadArticles();
    }, []);

    return (
        <div className={styles.page}>
        <section className={styles.hero}>
        <div className={styles.heroInner}>
        <span className={styles.eyebrow}>Knowledge Base</span>
    <h1 className={styles.title}>Articles</h1>
        <p className={styles.description}>
        Explore published articles, engineering notes and practical guides
    from CorkAirportDojo.
    </p>
    </div>
    </section>

    {loading && <ArticlesLoadingState />}

    {!loading && error && <ArticlesErrorState onRetry={() => void loadArticles()} />}

        {!loading && !error && articles.length === 0 && <ArticlesEmptyState />}

        {!loading && !error && articles.length > 0 && (
            <section className={styles.grid}>
                {articles.map((article) => (
                        <Card key={article.id} className={styles.card}>
                    <Link to={`/blog/${article.slug}`} className={styles.cardLink}>
        <CardContent className={styles.cardBody}>
        <div className={styles.cardTop}>
        <span className={styles.category}>
            {article.category ?? "General"}
            </span>
            {article.featured && (
                <span className={styles.featuredBadge}>Featured</span>
            )}
            </div>

            <h2 className={styles.cardTitle}>{article.title}</h2>

            {article.excerpt && (
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
            )}

            <div className={styles.cardFooter}>
            <div className={styles.meta}>
                <span>{article.author_name ?? "CorkAirportDojo"}</span>
                <span>{article.read_time ?? "Article"}</span>
                </div>

                <span className={styles.readMore}>
            Read Article <ArrowRight size={15} />
        </span>
        </div>
        </CardContent>
        </Link>
        </Card>
        ))}
            </section>
        )}
        </div>
    );
    }