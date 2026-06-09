import { Search } from "lucide-react";
import styles from "./ModulesToolbar.module.scss";

const topics = [
    "All",
    "React",
    "Node.js",
    "TypeScript",
    "Database",
    "Security",
    "AI",
    "Cloud",
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function ModulesToolbar() {
    return (
        <section className={styles.toolbar}>
            <div className={styles.searchWrap}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    placeholder="Search modules..."
                    aria-label="Search modules"
                />
            </div>

            <div className={styles.filterGroup}>
                {topics.map((topic, index) => (
                    <button
                        key={topic}
                        type="button"
                        className={`${styles.filterChip} ${
                            index === 0 ? styles.filterChipActive : ""
                        }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <div className={styles.filterGroup}>
                {difficulties.map((difficulty, index) => (
                    <button
                        key={difficulty}
                        type="button"
                        className={`${styles.filterChip} ${
                            index === 0 ? styles.filterChipActive : ""
                        }`}
                    >
                        {difficulty}
                    </button>
                ))}
            </div>
        </section>
    );
}