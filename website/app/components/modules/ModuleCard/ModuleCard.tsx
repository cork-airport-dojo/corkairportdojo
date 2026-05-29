import type { LucideIcon } from "lucide-react";
import { Badge } from "../../common/Badge/Badge";
import styles from "./ModuleCard.module.scss";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface ModuleCardProps {
    title: string;
    description: string;
    lessons: number;
    difficulty: Difficulty;
    icon: LucideIcon;
}

export function ModuleCard({
                               title,
                               description,
                               lessons,
                               difficulty,
                               icon: Icon,
                           }: ModuleCardProps) {
    const badgeVariant =
        difficulty === "Beginner"
            ? "beginner"
            : difficulty === "Intermediate"
                ? "intermediate"
                : "advanced";

    return (
        <article className={styles.card}>
            <div className={styles.iconWrap}>
                <Icon size={28} />
            </div>

            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.footer}>
                <Badge variant={badgeVariant}>{difficulty}</Badge>
                <span className={styles.lessonCount}>{lessons} Lessons</span>
            </div>
        </article>
    );
}