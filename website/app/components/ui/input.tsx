import * as React from "react";
import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-11 w-full min-w-0 rounded-none border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-base text-[var(--color-text)] shadow-none outline-none transition-colors file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand-purple)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(109,93,252,0.35)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            {...props}
        />
    );
}

export { Input };