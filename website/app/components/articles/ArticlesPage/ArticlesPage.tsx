import { useEffect, useState } from "react";
import { FileText, PenSquare, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { fetchArticles, type PublicArticle } from "~/lib/api/articles";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./ArticlesPage.module.scss";
import { ArticleCard, ArticleCardSkeleton } from "~/components/blog/ArticleCard/ArticleCard";
import { PaginationControls } from "~/components/ui/pagination";

const PAGE_SIZE = 50;
function ArticlesLoadingState() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <ArticleCardSkeleton key={`skel-${index}`} />
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
  const [page, setPage] = useState(1);

  const { canManageContent } = useAuthStore();

  const loadArticles = async (nextPage: number) => {
    setLoading(true);
    setError(false);

    try {
      const data = await fetchArticles({ page: nextPage, pageSize: PAGE_SIZE });
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadArticles(page);
  }, [page]);

  return (
    <div className={styles.page}>
      <div className={styles.topLayout}>
        <div className={styles.headerColumn}>
          <Card className={styles.heroCard}>
            <CardHeader className={styles.heroHeader}>
              <div className={styles.eyebrow}>Knowledge Base</div>
              <CardTitle className={styles.title}>Articles</CardTitle>
              <CardDescription className={styles.description}>
                Explore articles written by mentors. 
              </CardDescription>
            </CardHeader>

            {canManageContent && (
              <CardContent className={styles.heroActions}>
                <Link
                  to="/write"
                  className={styles.headerAction}
                  aria-label="Create article"
                >
                  <PenSquare size={16} />
                  <span>New Article</span>
                </Link>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {loading && <ArticlesLoadingState />}

      {!loading && error && <ArticlesErrorState onRetry={() => void loadArticles(page)} />}

      {!loading && !error && articles.length === 0 && <ArticlesEmptyState />}

      {!loading && !error && articles.length > 0 && (
        <section className={styles.grid}>
          {articles.map((article) => (
            <ArticleCard
              key={`article-${article.id}`}
              id={article.slug}
              title={article.title}
              excerpt={article.excerpt ?? ""}
              image={article.cover_image ?? "/logo.webp"}
              author={article.author_name ?? "CorkAirportDojo"}
              authorAvatarUrl={article.author_avatar_url}
              date={new Intl.DateTimeFormat("en-IE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(article.created_at))}
              readTime={article.read_time ?? ""}
              resourceCount={article.resources?.length ?? 0}
            />
          ))}
        </section>
      )}

      {!loading && !error && articles.length > 0 && (
        <PaginationControls
          className={styles.pagination}
          currentPage={page}
          itemCount={articles.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}