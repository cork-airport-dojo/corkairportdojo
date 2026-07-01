import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-[rgba(8,10,15,0.78)] backdrop-blur-[4px]",
            className
        )}
        {...props}
        ref={ref}
    />
));

SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
}
>(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed z-50 bg-[var(--color-bg-elevated)] p-0 text-[var(--color-text)] shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition ease-in-out outline-none",
                side === "right" &&
                "inset-y-0 right-0 h-full w-3/4 border-l border-[var(--color-border)] sm:max-w-sm",
                side === "left" &&
                "inset-y-0 left-0 h-full w-3/4 border-r border-[var(--color-border)] sm:max-w-sm",
                side === "top" &&
                "inset-x-0 top-0 border-b border-[var(--color-border)]",
                side === "bottom" &&
                "inset-x-0 bottom-0 border-t border-[var(--color-border)]",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-none border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(109,93,252,0.45)]">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </SheetPortal>
));

SheetContent.displayName = DialogPrimitive.Content.displayName;

export const SheetHeader = ({
                                className,
                                ...props
                            }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col gap-2 px-6 py-5 text-left", className)}
        {...props}
    />
);

export const SheetFooter = ({
                                className,
                                ...props
                            }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse gap-2 border-t border-[var(--color-border)] px-6 py-4 sm:flex-row sm:justify-end",
            className
        )}
        {...props}
    />
);

export const SheetTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-base font-semibold text-[var(--color-text)]",
            className
        )}
        {...props}
    />
));

SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-[var(--color-text-secondary)]", className)}
        {...props}
    />
));

SheetDescription.displayName = DialogPrimitive.Description.displayName;