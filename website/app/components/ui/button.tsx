import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(109,93,252,0.45)]",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--color-brand-purple)] text-white border border-transparent hover:bg-[var(--color-brand-purple-hover)]",
                destructive:
                    "bg-[var(--color-danger)] text-white border border-transparent hover:opacity-95",
                outline:
                    "border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-border-hover)]",
                secondary:
                    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]",
                ghost:
                    "border border-transparent bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]",
                link: "text-[var(--color-brand-blue)] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-5",
                icon: "size-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
                    className,
                    variant,
                    size,
                    asChild = false,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };