import type { ResourceRecord } from "~/lib/api/resources";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

interface DeleteResourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resource: ResourceRecord | null;
    onConfirm: () => Promise<void>;
    isDeleting?: boolean;
}

export function DeleteResourceDialog({
                                         open,
                                         onOpenChange,
                                         resource,
                                         onConfirm,
                                         isDeleting = false,
                                     }: DeleteResourceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Resource</DialogTitle>
                    <DialogDescription>
                        {resource ? (
                            <>
                                Are you sure you want to delete{" "}
                                <strong>{resource.title}</strong>? This action cannot be undone.
                            </>
                        ) : (
                            "Are you sure you want to delete this resource? This action cannot be undone."
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => void onConfirm()}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Resource"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}