import styles from "./RailCardHeader.module.scss";

interface RailCardHeaderProps {
    title: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function RailCardHeader({
                                   title,
                                   icon,
                                   action,
                                   className,
                               }: RailCardHeaderProps) {
    return (
        <div className={`${styles.header} ${className ?? ""}`}>
            <div className={styles.titleRow}>
                <h3>{title}</h3>
                {icon && <span className={styles.iconWrap}>{icon}</span>}
            </div>

            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}