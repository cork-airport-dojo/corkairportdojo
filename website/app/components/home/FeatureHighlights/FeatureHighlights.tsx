import { BookOpen, Layers3, PenTool, Users } from "lucide-react";
import styles from "./FeatureHighlights.module.scss";

const items = [
    {
        icon: PenTool,
        title: "Expert Writers",
        description: "Industry-focused insights",
    },
    {
        icon: Layers3,
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

export function FeatureHighlights() {
    return (
        <div className={styles.grid}>
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div key={item.title} className={styles.item}>
                        <div className={styles.iconWrap}>
                            <Icon size={16} />
                        </div>

                        <div className={styles.text}>
                            <span className={styles.title}>{item.title}</span>
                            <span className={styles.description}>{item.description}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}