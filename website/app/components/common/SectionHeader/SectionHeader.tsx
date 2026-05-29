import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    actionHref?: string;
}

export function SectionHeader({
                                  title,
                                  actionLabel,
                                  actionHref,
                              }: SectionHeaderProps) {
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>

            {actionLabel && actionHref ? (
                <Link to={actionHref} className={styles.action}>
                    <span>{actionLabel}</span>
                    <ArrowRight size={16} />
                </Link>
            ) : null}
        </div>
    );
}