import * as React from "react";
import { cn } from "~/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                className={cn(
                    "flex w-full min-w-0 border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    "focus-visible:ring-2 focus-visible:ring-[rgba(139,92,246,0.35)]",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";