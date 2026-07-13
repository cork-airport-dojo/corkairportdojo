import styles from "./StatusPill.module.scss";

interface StatusPillProps {
    published: boolean;
}

export function StatusPill({ published }: StatusPillProps) {
    return (
        <span
            className={`${styles.pill} ${
                published ? styles.published : styles.draft
            }`}
        >
            {published ? "Published" : "Draft"}
        </span>
    );
}