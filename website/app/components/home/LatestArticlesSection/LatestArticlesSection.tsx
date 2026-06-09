import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../../common/SectionHeader/SectionHeader";
import { ArticleCard } from "../../blog/ArticleCard/ArticleCard";
import styles from "./LatestArticlesSection.module.scss";

const articles = [
    {
        title: "Understanding Next.js 14 App Router",
        excerpt:
            "Explore layouts, nested routing, server components and rendering patterns in the new app router.",
        category: "Next.js",
        image: "https://picsum.photos/seed/nextjs-article/900/600",
        author: "Chris Murphy",
        date: "June 2, 2026",
        readTime: "6 min read",
    },
    {
        title: "TypeScript Tips for Better Development",
        excerpt:
            "Use smarter typing patterns, utility types and cleaner interfaces to improve maintainability.",
        category: "TypeScript",
        image: "https://picsum.photos/seed/typescript-article/900/600",
        author: "Chris Murphy",
        date: "May 28, 2026",
        readTime: "5 min read",
    },
    {
        title: "Database Design Principles Every Developer Should Know",
        excerpt:
            "Learn practical schema design, normalization trade-offs and indexing ideas that matter in real apps.",
        category: "Database",
        image: "https://picsum.photos/seed/database-article/900/600",
        author: "Chris Murphy",
        date: "May 20, 2026",
        readTime: "7 min read",
    },
    {
        title: "Why React Architecture Matters",
        excerpt:
            "A practical guide to structuring scalable React applications with better boundaries and shared logic.",
        category: "React",
        image: "https://picsum.photos/seed/react-architecture/900/600",
        author: "Chris Murphy",
        date: "May 12, 2026",
        readTime: "8 min read",
    },
];

export function LatestArticlesSection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

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
    }, []);

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
                    {articles.map((article) => (
                        <div key={article.title} className={styles.slide}>
                            <ArticleCard
                                title={article.title}
                                excerpt={article.excerpt}
                                category={article.category}
                                image={article.image}
                                author={article.author}
                                date={article.date}
                                readTime={article.readTime}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.dots}>
                {articles.map((article, index) => (
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