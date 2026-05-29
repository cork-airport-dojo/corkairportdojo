import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

export function Button({
                           children,
                           variant = "primary",
                           size = "md",
                           fullWidth = false,
                           className = "",
                           type = "button",
                           ...props
                       }: ButtonProps) {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    );
}