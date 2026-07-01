import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import styles from "./ModuleCard.module.scss";

interface ModuleCardProps {
    title: string;
    description: string;
    lessons: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    icon: LucideIcon;
}

export function ModuleCard({
                               title,
                               description,
                               lessons,
                               difficulty,
                               icon: Icon,
                           }: ModuleCardProps) {
    const difficultyClass =
        difficulty === "Beginner"
            ? styles.beginner
            : difficulty === "Intermediate"
                ? styles.intermediate
                : styles.advanced;

    return (
        <Card className={styles.card}>
            <CardContent className={styles.content}>
                <div className={styles.headerRow}>
                    <div className={styles.iconWrap}>
                        <Icon size={22} strokeWidth={1.9} />
                    </div>

                    <div className={styles.textBlock}>
                        <h3 className={styles.title}>{title}</h3>
                        <p className={styles.description}>{description}</p>
                    </div>
                </div>

                <div className={styles.footerRow}>
                    <span className={`${styles.levelBadge} ${difficultyClass}`}>
                        {difficulty}
                    </span>
                    <span className={styles.lessons}>{lessons}</span>
                </div>
            </CardContent>
        </Card>
    );
}