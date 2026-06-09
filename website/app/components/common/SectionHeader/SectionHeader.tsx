import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    actionHref?: string;
    actions?: React.ReactNode;
}

export function SectionHeader({
                                  title,
                                  actionLabel,
                                  actionHref,
                                  actions,
                              }: SectionHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <h2>{title}</h2>

                {actionLabel && actionHref && (
                    <Link to={actionHref} className={styles.linkAction}>
                        <span>{actionLabel}</span>
                        <ArrowRight size={18} />
                    </Link>
                )}
            </div>

            {actions && <div className={styles.right}>{actions}</div>}
        </div>
    );
}