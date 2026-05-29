import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.scss";

type BadgeVariant =
    | "beginner"
    | "intermediate"
    | "advanced"
    | "topic"
    | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: BadgeVariant;
}

export function Badge({
                          children,
                          variant = "topic",
                          className = "",
                          ...props
                      }: BadgeProps) {
    const classes = [styles.badge, styles[variant], className]
        .filter(Boolean)
        .join(" ");

    return (
        <span className={classes} {...props}>
      {children}
    </span>
    );
}