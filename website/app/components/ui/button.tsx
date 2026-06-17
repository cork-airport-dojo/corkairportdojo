import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:opacity-90",
                destructive:
                    "bg-destructive text-white hover:opacity-90",
                outline:
                    "border border-border bg-transparent hover:bg-white/5",
                secondary:
                    "bg-secondary text-secondary-foreground hover:opacity-90",
                ghost:
                    "hover:bg-white/5",
                link:
                    "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-6",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export function Button({
                           className,
                           variant,
                           size,
                           asChild = false,
                           ...props
                       }: ButtonProps) {
    if (asChild) {
        const child = React.Children.only(props.children) as React.ReactElement;
        return React.cloneElement(child, {
            className: cn(buttonVariants({ variant, size, className }), child.props.className),
        });
    }

    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { buttonVariants };