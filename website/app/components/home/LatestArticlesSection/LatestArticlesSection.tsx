import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, RefreshCw } from "lucide-react";
import { SectionHeader } from "../../common/SectionHeader/SectionHeader";
import { ArticleCard } from "~/components/blog/ArticleCard/ArticleCard";
import { fetchArticles, type PublicArticle } from "~/lib/api/articles";
import styles from "./LatestArticlesSection.module.scss";

function LatestArticlesLoadingState() {
    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Latest Articles"
                    actionLabel="View all"
                    actionHref="/articles"
                />

                <div className={styles.controls}>
                    <button type="button" className={styles.controlButton} disabled>
                        <ChevronLeft size={18} />
                    </button>
                    <button type="button" className={styles.controlButton} disabled>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.trackWrap}>
                <div className={styles.track}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className={styles.slide}>
                            <div className={styles.skeletonCard}>
                                <div className={styles.skeletonImage} />
                                <div className={styles.skeletonBody}>
                                    <div className={styles.skeletonBadge} />
                                    <div className={styles.skeletonTitle} />
                                    <div className={styles.skeletonExcerpt} />
                                    <div className={styles.skeletonExcerptShort} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LatestArticlesEmptyState() {
    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Latest Articles"
                    actionLabel="View all"
                    actionHref="/articles"
                />
            </div>

            <div className={styles.stateCard}>
                <div className={styles.stateIconWrap}>
                    <FileText size={18} />
                </div>
                <div>
                    <h2>No articles yet</h2>
                    <p>Published articles will appear here once they have been created.</p>
                </div>
            </div>
        </section>
    );
}

function LatestArticlesErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Latest Articles"
                    actionLabel="View all"
                    actionHref="/articles"
                />
            </div>

            <div className={styles.stateCard}>
                <div className={styles.stateIconWrap}>
                    <RefreshCw size={18} />
                </div>
                <div>
                    <h2>Unable to load articles</h2>
                    <p>There was a problem loading the latest articles right now.</p>
                    <button
                        type="button"
                        className={styles.retryButton}
                        onClick={onRetry}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </section>
    );
}

export function LatestArticlesSection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [articles, setArticles] = useState<PublicArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadArticles = async () => {
        setLoading(true);
        setError(false);

        try {
            const data = await fetchArticles();
            setArticles(data.slice(0, 4));
        } catch (err) {
            console.error("Failed to load latest articles:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadArticles();
    }, []);

    const cardArticles = useMemo(
        () =>
            articles.map((article) => ({
                id: article.slug,
                title: article.title,
                excerpt: article.excerpt ?? "",
                category: article.category ?? "General",
                image: article.cover_image ?? "/logo.png",
                author: article.author_name ?? "CorkAirportDojo",
                authorAvatarUrl: article.author_avatar_url ?? null,
                date: new Date(article.created_at).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                readTime: article.read_time ?? "Article",
                resourceCount: 0,
            })),
        [articles]
    );

    const scrollByAmount = (direction: "left" | "right") => {
        if (!trackRef.current) return;

        const amount = 340;
        trackRef.current.scrollBy({
            left: direction === "right" ? amount : -amount,
            behavior: "smooth",
        });
    };

    const scrollToIndex = (index: number) => {
        const track = trackRef.current;
        if (!track) return;

        const slide = track.children[index] as HTMLElement | undefined;
        if (!slide) return;

        track.scrollTo({
            left: slide.offsetLeft - track.offsetLeft,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const handleScroll = () => {
            const children = Array.from(track.children) as HTMLElement[];
            if (!children.length) return;

            const scrollLeft = track.scrollLeft;
            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            children.forEach((child, index) => {
                const distance = Math.abs(
                    child.offsetLeft - track.offsetLeft - scrollLeft
                );

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        handleScroll();
        track.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            track.removeEventListener("scroll", handleScroll);
        };
    }, [cardArticles.length]);

    if (loading) {
        return <LatestArticlesLoadingState />;
    }

    if (error) {
        return <LatestArticlesErrorState onRetry={() => void loadArticles()} />;
    }

    if (cardArticles.length === 0) {
        return <LatestArticlesEmptyState />;
    }

    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Latest Articles"
                    actionLabel="View all"
                    actionHref="/articles"
                />

                <div className={styles.controls}>
                    <button
                        type="button"
                        className={styles.controlButton}
                        onClick={() => scrollByAmount("left")}
                        aria-label="Scroll articles left"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        className={styles.controlButton}
                        onClick={() => scrollByAmount("right")}
                        aria-label="Scroll articles right"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.trackWrap}>
                <div className={styles.track} ref={trackRef}>
                    {cardArticles.map((article) => (
                        <div key={article.id} className={styles.slide}>
                            <ArticleCard {...article} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.dots}>
                {cardArticles.map((article, index) => (
                    <button
                        key={article.id}
                        type="button"
                        className={`${styles.dot} ${
                            activeIndex === index ? styles.dotActive : ""
                        }`}
                        onClick={() => scrollToIndex(index)}
                        aria-label={`Go to article ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}