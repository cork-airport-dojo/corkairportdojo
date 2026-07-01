import * as React from "react";
import { cn } from "~/lib/utils";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-[96px] w-full min-w-0 rounded-none border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50",
                    "focus-visible:border-[var(--color-brand-purple)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(109,93,252,0.35)]",
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";