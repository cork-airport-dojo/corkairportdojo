import { useEffect } from "react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { StatusPill } from "~/components/admin/StatusPill/StautsPill";
import { useAuthStore } from "~/store/use-auth-store";
import { useProfileArticlesStore } from "~/store/use-profile-articles-store";
import styles from "./ArticleManager.module.scss";

export function ArticleManager() {
    const { role } = useAuthStore();
    const { articles, isLoading, error, hydrate, removeArticle } =
        useProfileArticlesStore();

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.titleRow}>
                    <div className={styles.iconWrap}>
                        <FileText size={16} />
                    </div>

                    <div>
                        <h2>Manage Articles</h2>
                        <p className={styles.subtitle}>
                            {role === "admin"
                                ? "You can see all articles, including drafts."
                                : "You can see only articles you created, including drafts."}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className={styles.body}>
                {isLoading && (
                    <div className={styles.emptyState}>Loading articles...</div>
                )}

                {!isLoading && error && (
                    <div className={styles.emptyState}>{error}</div>
                )}

                {!isLoading && !error && articles.length === 0 && (
                    <div className={styles.emptyState}>
                        No articles available for your account yet.
                    </div>
                )}

                {!isLoading && !error && articles.length > 0 && (
                    <div className={styles.articleList}>
                        {articles.map((article) => (
                            <div key={article.id} className={styles.articleItem}>
                                <div className={styles.articleText}>
                                    <div className={styles.articleMetaRow}>
                                        {article.featured && (
                                            <span className={styles.badge}>Featured</span>
                                        )}

                                        <StatusPill published={article.published} />
                                    </div>

                                    <strong>{article.title}</strong>

                                    {article.excerpt && <span>{article.excerpt}</span>}

                                    <div className={styles.secondaryMeta}>
                                        {article.author_name && (
                                            <span>Author: {article.author_name}</span>
                                        )}
                                        {article.read_time && (
                                            <span>{article.read_time}</span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.articleActions}>
                                    <Button asChild type="button" variant="outline" size="icon">
                                        <Link
                                            to={`/blog/${article.slug}/edit`}
                                            aria-label="Edit article"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => void removeArticle(article.id)}
                                        aria-label="Delete article"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}