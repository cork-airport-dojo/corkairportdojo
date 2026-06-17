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
                    "flex min-h-[80px] w-full min-w-0 border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    "focus-visible:ring-2 focus-visible:ring-[rgba(139,92,246,0.35)]",
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";