import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../../common/SectionHeader/SectionHeader";
import { ArticleCard } from "../../blog/ArticleCard/ArticleCard";
import { fetchArticles, type PublicArticle } from "~/lib/api/articles";
import styles from "./LatestArticlesSection.module.scss";

export function LatestArticlesSection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [articles, setArticles] = useState<PublicArticle[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchArticles();
                setArticles(data.slice(0, 4));
            } catch (error) {
                console.error("Failed to load latest articles:", error);
                setArticles([]);
            }
        }

        void load();
    }, []);

    const cardArticles = articles.map((article) => ({
        id: article.slug,
        title: article.title,
        excerpt: article.excerpt ?? "",
        category: article.category ?? "General",
        image: article.cover_image ?? "/logo.png",
        author: article.author_name ?? "CorkAirportDojo",
        date: new Date(article.created_at).toLocaleDateString("en-IE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        readTime: article.read_time ?? "Article",
        resourceCount: 0,
    }));

    const scrollByAmount = (direction: "left" | "right") => {
        if (!trackRef.current) return;

        const amount = 380;
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

    if (cardArticles.length === 0) {
        return (
            <section className={styles.section}>
                <div className={styles.topRow}>
                    <SectionHeader
                        title="Latest Articles"
                        actionLabel="View all"
                        actionHref="/blog"
                    />
                </div>

                <div className={styles.emptyState}>
                    <p>No published articles yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Latest Articles"
                    actionLabel="View all"
                    actionHref="/blog"
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
                        key={article.title}
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