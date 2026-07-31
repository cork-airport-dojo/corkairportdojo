import { Link } from "react-router";
import { BookOpen } from "lucide-react";
import type { ModuleDifficulty } from "~/lib/constants/modules";
import { Card, CardContent } from "~/components/ui/card";
import styles from "./ModuleCard.module.scss";
import Truncated from "~/components/common/Truncated/Truncated";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface ModuleCardProps {
    id: string;
    title: string;
    description: string;
    difficulty: ModuleDifficulty;
    icon_key: IconName;
}

export function ModuleCard({
    id,
    title,
    description,
    difficulty,
    icon_key,
}: ModuleCardProps) {
    const difficultyClass =
        difficulty === "Beginner"
            ? styles.beginner
            : difficulty === "Intermediate"
                ? styles.intermediate
                : styles.advanced;

    return (
        <Card className={styles.card}>
            <Link to={`/modules/${id}`} className={styles.cardLink}>
                <CardContent className={styles.content}>
                    <div className={styles.headerRow}>
                        <div className={styles.iconWrap}>
                            <DynamicIcon name={icon_key} size={22} strokeWidth={1.9} />
                        </div>

                        <div className={styles.textBlock}>
                            <h3 className={styles.title}>{title}</h3>
                            <p className={styles.description}><Truncated length={100}>{description}</Truncated></p>
                        </div>
                    </div>

                    <div className={styles.footerRow}>
                        <span className={`${styles.levelBadge} ${difficultyClass}`}>
                            {difficulty}
                        </span>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}