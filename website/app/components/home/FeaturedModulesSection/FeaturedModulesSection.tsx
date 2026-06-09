import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../../common/SectionHeader/SectionHeader";
import { modules } from "~/lib/constants/modules";
import { ModuleCard } from "../../modules/ModuleCard/ModuleCard";
import styles from "./FeaturedModulesSection.module.scss";

export function FeaturedModulesSection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

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
                    {modules.map((module) => (
                        <div key={module.title} className={styles.slide}>
                            <ModuleCard
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
                {modules.map((module, index) => (
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