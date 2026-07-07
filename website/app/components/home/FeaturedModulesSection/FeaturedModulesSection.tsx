import { useEffect, useRef, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../../common/SectionHeader/SectionHeader";
import { useCustomModulesStore } from "~/store/use-custom-modules-store";
import { getAllModules } from "~/lib/get-all-modules";
import { ModuleCard } from "../../modules/ModuleCard/ModuleCard";
import styles from "./FeaturedModulesSection.module.scss";

export function FeaturedModulesSection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { modules: customModules, hydrate } = useCustomModulesStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const featuredModules = useMemo(() => {
        return getAllModules(customModules).filter((module) => module.featured);
    }, [customModules]);

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
    }, []);

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
                    {featuredModules.map((module) => (
                        <div key={module.title} className={styles.slide}>
                            <ModuleCard
                                key={module.id}
                                id={module.id}
                                title={module.title}
                                description={module.description}
                                lessons={module.lessons}
                                difficulty={module.difficulty}
                                icon={module.icon}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.dots}>
                {featuredModules.map((module, index) => (
                    <button
                        key={module.title}
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