import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";

function Checkbox({
                      className,
                      ...props
                  }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer border-[var(--color-border)] data-[state=checked]:bg-[var(--color-brand-blue)] data-[state=checked]:text-white focus-visible:border-[var(--color-border-hover)] focus-visible:ring-[3px] focus-visible:ring-white/10 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 size-4 shrink-0 border shadow-none outline-none transition-shadow disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current transition-none"
            >
                <Check className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };