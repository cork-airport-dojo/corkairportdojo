import { BookOpen, Layers3, Newspaper, Users, PenTool, Boxes } from "lucide-react";
import { Button } from "~/components/ui/button";
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
                        <Button className={styles.primaryButton} size="lg">
                            <Layers3 size={18} />
                            <span>Browse Modules</span>
                        </Button>

                        <Button
                            variant="outline"
                            className={styles.secondaryButton}
                            size="lg"
                        >
                            <Newspaper size={18} />
                            <span>Read Articles</span>
                        </Button>

                        <Button
                            variant="outline"
                            className={styles.registerButton}
                            size="lg"
                        >
                            <span>Register next term</span>
                        </Button>
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