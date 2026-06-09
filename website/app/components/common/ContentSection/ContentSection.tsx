import styles from "./ContentSection.module.scss";

interface ContentSectionProps {
    children: React.ReactNode;
    className?: string;
}

export function ContentSection({
                                   children,
                                   className,
                               }: ContentSectionProps) {
    return <section className={`${styles.section} ${className ?? ""}`}>{children}</section>;
}