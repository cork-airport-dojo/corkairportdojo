import { useEffect, useRef, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { SectionHeader } from "../../common/SectionHeader/SectionHeader";
import { fetchModules, type PublicModule } from "~/lib/api/modules";
import { moduleIconMap } from "~/lib/modules";
import { ModuleCard } from "../../modules/ModuleCard/ModuleCard";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import styles from "./FeaturedModulesSection.module.scss";

function FeaturedModulesLoadingState() {
    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Featured Modules"
                    actionLabel="View all"
                    actionHref="/modules"
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
                            <Card className={styles.stateCard}>
                                <CardContent className={styles.skeletonCardBody}>
                                    <div className={styles.skeletonBadge} />
                                    <div className={styles.skeletonTitle} />
                                    <div className={styles.skeletonText} />
                                    <div className={styles.skeletonTextShort} />
                                    <div className={styles.skeletonFooter} />
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturedModulesEmptyState() {
    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Featured Modules"
                    actionLabel="View all"
                    actionHref="/modules"
                />
            </div>

            <Card className={styles.stateCard}>
                <CardHeader className={styles.stateHeader}>
                    <div className={styles.stateIconWrap}>
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <h2>No featured modules yet</h2>
                        <p>Featured published modules will appear here once they are added.</p>
                    </div>
                </CardHeader>
            </Card>
        </section>
    );
}

function FeaturedModulesErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Featured Modules"
                    actionLabel="View all"
                    actionHref="/modules"
                />
            </div>

            <Card className={styles.stateCard}>
                <CardHeader className={styles.stateHeader}>
                    <div className={styles.stateIconWrap}>
                        <RefreshCw size={18} />
                    </div>
                    <div>
                        <h2>Unable to load featured modules</h2>
                        <p>There was a problem loading featured modules right now.</p>
                    </div>
                </CardHeader>

                <CardContent className={styles.stateBody}>
                    <button
                        type="button"
                        className={styles.retryButton}
                        onClick={onRetry}
                    >
                        Try Again
                    </button>
                </CardContent>
            </Card>
        </section>
    );
}

export function FeaturedModulesSection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [modules, setModules] = useState<PublicModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadModules = async () => {
        setLoading(true);
        setError(false);

        try {
            const data = await fetchModules();
            setModules(data);
        } catch (err) {
            console.error("Failed to load featured modules:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadModules();
    }, []);

    const featuredModules = useMemo(() => {
        return modules.filter((module) => module.featured);
    }, [modules]);

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
    }, [featuredModules.length]);

    if (loading) {
        return <FeaturedModulesLoadingState />;
    }

    if (error) {
        return <FeaturedModulesErrorState onRetry={() => void loadModules()} />;
    }

    if (featuredModules.length === 0) {
        return <FeaturedModulesEmptyState />;
    }

    return (
        <section className={styles.section}>
            <div className={styles.topRow}>
                <SectionHeader
                    title="Featured Modules"
                    actionLabel="View all"
                    actionHref="/modules"
                />

                <div className={styles.controls}>
                    <button
                        type="button"
                        className={styles.controlButton}
                        onClick={() => scrollByAmount("left")}
                        aria-label="Scroll modules left"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        type="button"
                        className={styles.controlButton}
                        onClick={() => scrollByAmount("right")}
                        aria-label="Scroll modules right"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.trackWrap}>
                <div className={styles.track} ref={trackRef}>
                    {featuredModules.map((module) => {
                        const icon = moduleIconMap.react;

                        return (
                            <div key={module.id} className={styles.slide}>
                                <ModuleCard
                                    id={module.slug}
                                    title={module.title}
                                    description={module.description ?? ""}
                                    lessons={module.lessons}
                                    difficulty={module.difficulty ?? "Beginner"}
                                    icon={icon}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.dots}>
                {featuredModules.map((module, index) => (
                    <button
                        key={module.id}
                        type="button"
                        className={`${styles.dot} ${
                            activeIndex === index ? styles.dotActive : ""
                        }`}
                        onClick={() => scrollToIndex(index)}
                        aria-label={`Go to module ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}