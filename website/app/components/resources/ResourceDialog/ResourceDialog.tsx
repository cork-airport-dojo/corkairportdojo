import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Cloud,
    Folder,
    Link2,
} from "lucide-react";
import { FiGithub } from "react-icons/fi";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import styles from "./ResourceDialog.module.scss";

interface ResourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (input: {
        title: string;
        description: string;
        category: string;
        tags: string[];
        image: string;
        provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
        href: string;
        active: boolean;
    }) => Promise<void>;
    initialResource?: ResourceRecord | null;
}

type ProviderValue = "Google Drive" | "OneDrive" | "GitHub" | "External";

type FieldErrors = Partial<Record<
    "title" | "description" | "category" | "image" | "href",
    string
>>;

function normalizeUrl(value: string) {
    const trimmed = value.trim();

    if (!trimmed) return trimmed;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    return `https://${trimmed}`;
}

function isValidUrl(value: string) {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

function getProviderIcon(provider: ProviderValue) {
    switch (provider) {
        case "Google Drive":
            return <Folder size={16} />;
        case "OneDrive":
            return <Cloud size={16} />;
        case "GitHub":
            return <FiGithub size={16} />;
        case "External":
        default:
            return <Link2 size={16} />;
    }
}

export function ResourceDialog({
                                   open,
                                   onOpenChange,
                                   onSubmit,
                                   initialResource,
                               }: ResourceDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState("");
    const [provider, setProvider] = useState<ProviderValue>("External");
    const [href, setHref] = useState("");
    const [active, setActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    useEffect(() => {
        if (!initialResource) {
            setTitle("");
            setDescription("");
            setCategory("");
            setTags("");
            setImage("");
            setProvider("External");
            setHref("");
            setActive(true);
            setSubmitError(null);
            setFieldErrors({});
            return;
        }

        setTitle(initialResource.title);
        setDescription(initialResource.description);
        setCategory(initialResource.category);
        setTags(initialResource.tags.join(", "));
        setImage(initialResource.image);
        setProvider(initialResource.provider);
        setHref(initialResource.href);
        setActive(initialResource.active);
        setSubmitError(null);
        setFieldErrors({});
    }, [initialResource, open]);

    const providerIcon = useMemo(() => getProviderIcon(provider), [provider]);

    const validate = () => {
        const nextErrors: FieldErrors = {};

        if (!title.trim()) nextErrors.title = "Title is required.";
        if (!description.trim()) nextErrors.description = "Description is required.";
        if (!category.trim()) nextErrors.category = "Category is required.";

        const normalizedImage = normalizeUrl(image);
        if (!image.trim()) {
            nextErrors.image = "Image URL is required.";
        } else if (!isValidUrl(normalizedImage)) {
            nextErrors.image = "Enter a valid URL, for example https://example.com/image.png";
        }

        const normalizedHref = normalizeUrl(href);
        if (!href.trim()) {
            nextErrors.href = "Resource URL is required.";
        } else if (!isValidUrl(normalizedHref)) {
            nextErrors.href = "Enter a valid URL, for example https://example.com";
        }

        setFieldErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSave = async () => {
        setSubmitError(null);

        if (!validate()) {
            return;
        }

        setIsSaving(true);

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                category: category.trim(),
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                image: normalizeUrl(image),
                provider,
                href: normalizeUrl(href),
                active,
            });

            onOpenChange(false);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Unable to save resource. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.dialog}>
                <DialogHeader>
                    <DialogTitle>
                        {initialResource ? "Edit Resource" : "Add New Resource"}
                    </DialogTitle>
                    <DialogDescription>
                        Required fields are marked with <span className={styles.requiredMark}>*</span>.
                    </DialogDescription>
                </DialogHeader>

                {submitError && (
                    <Alert variant="destructive">
                        <AlertCircle size={16} />
                        <AlertTitle>Could not save resource</AlertTitle>
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                <div className={styles.form}>
                    <div className={styles.field}>
                        <Label htmlFor="resource-title">
                            Title <span className={styles.requiredMark}>*</span>
                        </Label>
                        <Input
                            id="resource-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.title)}
                            className={fieldErrors.title ? styles.invalidInput : ""}
                        />
                        <p className={styles.helpText}>Short, clear name for the resource.</p>
                        {fieldErrors.title && (
                            <p className={styles.errorText}>{fieldErrors.title}</p>
                        )}
                    </div>

                    <div className={styles.field}>
                        <Label htmlFor="resource-description">
                            Description <span className={styles.requiredMark}>*</span>
                        </Label>
                        <Input
                            id="resource-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.description)}
                            className={fieldErrors.description ? styles.invalidInput : ""}
                        />
                        <p className={styles.helpText}>
                            Brief explanation of what the resource is for.
                        </p>
                        {fieldErrors.description && (
                            <p className={styles.errorText}>{fieldErrors.description}</p>
                        )}
                    </div>

                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <Label htmlFor="resource-category">
                                Category <span className={styles.requiredMark}>*</span>
                            </Label>
                            <Input
                                id="resource-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                aria-invalid={Boolean(fieldErrors.category)}
                                className={fieldErrors.category ? styles.invalidInput : ""}
                            />
                            <p className={styles.helpText}>Example: AI, React, Security.</p>
                            {fieldErrors.category && (
                                <p className={styles.errorText}>{fieldErrors.category}</p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <Label htmlFor="resource-provider">
                                Provider <span className={styles.requiredMark}>*</span>
                            </Label>
                            <div className={styles.providerSelectWrap}>
                                <span className={styles.providerIcon}>{providerIcon}</span>
                                <select
                                    id="resource-provider"
                                    className={styles.select}
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value as ProviderValue)}
                                >
                                    <option>Google Drive</option>
                                    <option>OneDrive</option>
                                    <option>GitHub</option>
                                    <option>External</option>
                                </select>
                            </div>
                            <p className={styles.helpText}>
                                Choose where this resource lives or is managed.
                            </p>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <Label htmlFor="resource-tags">Tags</Label>
                        <Input
                            id="resource-tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Comma separated"
                        />
                        <p className={styles.helpText}>
                            Optional. Example: docs, starter, api
                        </p>
                    </div>

                    <div className={styles.field}>
                        <Label htmlFor="resource-image">
                            Image URL <span className={styles.requiredMark}>*</span>
                        </Label>
                        <Input
                            id="resource-image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.image)}
                            className={fieldErrors.image ? styles.invalidInput : ""}
                            placeholder="https://example.com/preview.png"
                        />
                        <p className={styles.helpText}>
                            Required. Use a full URL including https://
                        </p>
                        {fieldErrors.image && (
                            <p className={styles.errorText}>{fieldErrors.image}</p>
                        )}
                    </div>

                    <div className={styles.field}>
                        <Label htmlFor="resource-href">
                            Resource URL <span className={styles.requiredMark}>*</span>
                        </Label>
                        <Input
                            id="resource-href"
                            value={href}
                            onChange={(e) => setHref(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.href)}
                            className={fieldErrors.href ? styles.invalidInput : ""}
                            placeholder="https://example.com"
                        />
                        <p className={styles.helpText}>
                            Required. This is the link users will open.
                        </p>
                        {fieldErrors.href && (
                            <p className={styles.errorText}>{fieldErrors.href}</p>
                        )}
                    </div>

                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                        />
                        <span>
                            Active resource <em>(optional)</em>
                        </span>
                    </label>

                    {!Object.keys(fieldErrors).length && (
                        <Alert>
                            <CheckCircle2 size={16} />
                            <AlertTitle>Ready to save</AlertTitle>
                            <AlertDescription>
                                Required fields are complete and optional fields can be added later.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => void handleSave()} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Resource"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}