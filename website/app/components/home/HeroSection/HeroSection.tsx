import { useEffect, useMemo } from "react";
import { BookOpen, Users, PenTool, Boxes } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useHeroCTAStore } from "~/store/use-hero-cta-store";
import styles from "./HeroSection.module.scss";

const highlights = [
    {
        icon: PenTool,
        title: "Expert Writers",
        description: "Industry-focused insights",
    },
    {
        icon: Boxes,
        title: "Practical Examples",
        description: "Real-world technical learning",
    },
    {
        icon: BookOpen,
        title: "Regular Updates",
        description: "Fresh content every week",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Learn and build together",
    },
];

export function HeroSection() {
    const { buttons, hydrate, getVisibleButtons } = useHeroCTAStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const visibleButtons = useMemo(() => getVisibleButtons(), [buttons, getVisibleButtons]);
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <div className={styles.copy}>
                    <h1 className={styles.title}>
                        Code it.<span>Break it.</span>
                        <br />
                        Build it better.
                    </h1>

                    <p className={styles.description}>
                        Practical articles, structured modules and real-world lessons for
                        developers who want to sharpen how they build, debug and learn.
                    </p>

                    <div className={styles.actions}>
                        {visibleButtons.map((button) => (
                            <Button
                                key={button.id}
                                asChild
                                variant={
                                    button.variant === "outline"
                                        ? "outline"
                                        : button.variant === "secondary"
                                            ? "secondary"
                                            : "default"
                                }
                                className={styles.heroButton}
                            >
                                <Link to={button.href}>{button.label}</Link>
                            </Button>
                        ))}
                    </div>

                    <div className={styles.highlights}>
                        {highlights.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.title} className={styles.highlightItem}>
                                    <div className={styles.highlightLine} />
                                    <div className={styles.highlightHeader}>
                                        <Icon size={18} />
                                        <strong>{item.title}</strong>
                                    </div>
                                    <p>{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.visual}>
                    <img src="/logo.png" alt="CorkAirportDojo hero visual" />
                </div>
            </div>
        </section>
    );
}