import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Check, ChevronDown, FolderOpen, Search, X } from "lucide-react";
import {
    calculateReadingTime,
    calculateSeoScore,
    calculateWordCount,
    createSlug,
} from "~/lib/post-editor";
import {
    createArticleRequest,
    updateArticleRequest,
} from "~/lib/api/article-create";
import { fetchResources, type ResourceRecord } from "~/lib/api/resources";
import { uploadArticleCoverImage } from "~/lib/api/storage";
import { dataUrlToFile } from "~/lib/image";
import { useAuthStore } from "~/store/use-auth-store";
import { usePostEditorStore } from "~/store/use-post-editor-store";
import { useEditorShortcuts } from "~/hooks/use-editor-shortcuts";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { PostEditorHeader } from "../PostEditorHeader/PostEditorHeader";
import { PostEditorCard } from "../PostEditorCard/PostEditorCard";
import { PostEditorSidebar } from "../PostEditorSidebar/PostEditorSidebar";
import { CommandPalette } from "../CommandPalette/CommandPalette";
import styles from "./WritePostPage.module.scss";

interface ArticleApiRecord {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    author_name: string | null;
    author_avatar_url: string | null;
    cover_image: string | null;
    read_time: string | null;
    featured: boolean;
    published: boolean;
    body: string[];
    resource_ids?: string[];
}

function htmlToParagraphs(content: string) {
    return content
        .split(/\n{2,}/)
        .map((chunk) => chunk.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())
        .filter(Boolean);
}

function paragraphsToEditorContent(paragraphs: string[]) {
    return paragraphs.join("\n\n");
}

async function fetchArticleById(id: string) {
    const response = await fetch(`/api/profile/articles/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    const result = (await response.json().catch(() => null)) as
        | { message?: string; article?: ArticleApiRecord }
        | null;

    if (!response.ok) {
        throw new Error(result?.message || "Failed to load article.");
    }

    return result?.article ?? null;
}

export function WritePostPage() {
    const navigate = useNavigate();
    const params = useParams();
    const articleIdFromRoute = params.id;
    const isEditMode = Boolean(articleIdFromRoute);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const editorAnchorRef = useRef<HTMLDivElement>(null);

    const { user, userName, avatarUrl } = useAuthStore();
    const [isHydrating, setIsHydrating] = useState(isEditMode);
    const [pageError, setPageError] = useState<string | null>(null);

    const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
    const [availableResources, setAvailableResources] = useState<ResourceRecord[]>([]);
    const [resourceSearch, setResourceSearch] = useState("");
    const [resourcePickerOpen, setResourcePickerOpen] = useState(false);

    const {
        articleId,
        title,
        description,
        category,
        tags,
        coverImage,
        content,
        markdownMode,
        status,
        commandPaletteOpen,
        lastSavedAt,
        setTitle,
        setDescription,
        setCategory,
        addTag,
        removeTag,
        setCoverImage,
        setContent,
        setMarkdownMode,
        setStatus,
        saveDraft,
        clearDraft,
        resetEditor,
        hydrateFromArticle,
        setCommandPaletteOpen,
        setArticleIdentity,
    } = usePostEditorStore();

    useEffect(() => {
        let cancelled = false;

        const loadResources = async () => {
            try {
                const resources = await fetchResources();

                if (!cancelled) {
                    setAvailableResources(resources.filter((resource) => resource.active));
                }
            } catch (error) {
                console.error("Failed to load resources for article editor:", error);
            }
        };

        void loadResources();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        const hydrateEditor = async () => {
            if (!articleIdFromRoute) {
                resetEditor();
                setSelectedResourceIds([]);
                setIsHydrating(false);
                setPageError(null);
                return;
            }

            try {
                setIsHydrating(true);
                setPageError(null);

                const article = await fetchArticleById(articleIdFromRoute);

                if (!article || cancelled) return;

                hydrateFromArticle({
                    articleId: article.id,
                    articleSlug: article.slug,
                    title: article.title,
                    description: article.excerpt ?? "",
                    category: article.category ?? "General",
                    tags: [],
                    coverImage: article.cover_image ?? "",
                    content: paragraphsToEditorContent(
                        Array.isArray(article.body) ? article.body : []
                    ),
                    markdownMode: false,
                    status: article.published ? "published" : "draft",
                });

                setSelectedResourceIds(article.resource_ids ?? []);
            } catch (error) {
                console.error("Failed to hydrate article editor:", error);

                if (!cancelled) {
                    setPageError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load article."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsHydrating(false);
                }
            }
        };

        void hydrateEditor();

        return () => {
            cancelled = true;
        };
    }, [articleIdFromRoute, hydrateFromArticle, resetEditor]);

    useEffect(() => {
        if (isHydrating) return;

        const timeout = window.setTimeout(() => {
            saveDraft();
        }, 1200);

        return () => window.clearTimeout(timeout);
    }, [
        isHydrating,
        articleId,
        title,
        description,
        category,
        tags,
        coverImage,
        content,
        markdownMode,
        status,
        saveDraft,
    ]);

    const wordCount = useMemo(() => calculateWordCount(content), [content]);
    const readingTime = useMemo(() => calculateReadingTime(wordCount), [wordCount]);

    const seoScore = useMemo(
        () =>
            calculateSeoScore({
                title,
                description,
                category,
                tags,
                coverImage,
                content,
                markdownMode,
                status,
            }),
        [title, description, category, tags, coverImage, content, markdownMode, status]
    );

    const filteredResources = useMemo(() => {
        const query = resourceSearch.trim().toLowerCase();

        if (!query) return availableResources;

        return availableResources.filter((resource) => {
            return (
                resource.title.toLowerCase().includes(query) ||
                resource.description.toLowerCase().includes(query) ||
                resource.category.toLowerCase().includes(query) ||
                resource.provider.toLowerCase().includes(query)
            );
        });
    }, [availableResources, resourceSearch]);

    const selectedResources = useMemo(() => {
        return availableResources.filter((resource) =>
            selectedResourceIds.includes(resource.id)
        );
    }, [availableResources, selectedResourceIds]);

    const toggleResourceSelection = (resourceId: string) => {
        setSelectedResourceIds((current) =>
            current.includes(resourceId)
                ? current.filter((id) => id !== resourceId)
                : [...current, resourceId]
        );
    };

    const removeSelectedResource = (resourceId: string) => {
        setSelectedResourceIds((current) => current.filter((id) => id !== resourceId));
    };

    const saveMutation = useMutation({
        mutationFn: async (published: boolean) => {
            const generatedSlug = createSlug(title);

            if (!title.trim()) {
                throw new Error("Please enter a title before saving.");
            }

            const paragraphs = htmlToParagraphs(content);

            if (!paragraphs.length) {
                throw new Error("Please add article content before saving.");
            }

            let resolvedCoverImage = coverImage.trim();

            if (resolvedCoverImage.startsWith("data:image/")) {
                if (!user?.id) {
                    throw new Error("You must be signed in to upload an image.");
                }

                const file = dataUrlToFile(resolvedCoverImage, "article-cover.png");
                const upload = await uploadArticleCoverImage(file, user.id);
                resolvedCoverImage = upload.publicUrl;
            }

            const payload = {
                slug: generatedSlug,
                title: title.trim(),
                excerpt: description.trim(),
                body: paragraphs,
                category: category.trim() || "General",
                author_name: userName || "CorkAirportDojo",
                author_avatar_url: avatarUrl || "",
                cover_image: resolvedCoverImage,
                read_time: `${readingTime} min read`,
                featured: false,
                resource_ids: selectedResourceIds,
                published,
            };

            if (articleIdFromRoute) {
                return updateArticleRequest({
                    id: articleIdFromRoute,
                    ...payload,
                });
            }

            return createArticleRequest(payload);
        },
        onSuccess: (article, published) => {
            setArticleIdentity({
                articleId: article.id,
                articleSlug: article.slug,
            });

            setStatus(published ? "published" : "draft");
            saveDraft();

            if (published) {
                navigate(`/blog/${article.slug}`);
                return;
            }

            if (!articleIdFromRoute) {
                navigate(`/blog/${article.id}/edit`, { replace: true });
            }
        },
    });

    const handleSaveDraft = () => {
        setStatus("draft");
        saveMutation.mutate(false);
    };

    const handlePublish = () => {
        setStatus("published");
        saveMutation.mutate(true);
    };

    const handlePreview = () => {
        setMarkdownMode(!markdownMode);
    };

    const handleOpenCommandPalette = () => setCommandPaletteOpen(true);
    const handleCloseCommandPalette = () => setCommandPaletteOpen(false);

    useEditorShortcuts({
        onSaveDraft: handleSaveDraft,
        onPublish: handlePublish,
        onToggleCommandPalette: handleOpenCommandPalette,
    });

    useEffect(() => {
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleCloseCommandPalette();
        };

        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, []);

    return (
        <>
            <CommandPalette
                open={commandPaletteOpen}
                onClose={handleCloseCommandPalette}
                onSaveDraft={handleSaveDraft}
                onPreview={handlePreview}
                onPublish={handlePublish}
                onFocusTitle={() => titleInputRef.current?.focus()}
                onFocusEditor={() =>
                    editorAnchorRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
                onClearDraft={clearDraft}
            />

            <div className={styles.page}>
                <PostEditorHeader isEditMode={isEditMode} />

                {isHydrating ? (
                    <div style={{ color: "var(--color-text-secondary)" }}>
                        Loading article editor...
                    </div>
                ) : pageError ? (
                    <div style={{ color: "var(--color-danger, #ef4444)" }}>
                        {pageError}
                    </div>
                ) : (
                    <div className={styles.layout}>
                        <div ref={editorAnchorRef} className={styles.main}>
                            <PostEditorCard
                                title={title}
                                description={description}
                                category={category}
                                tags={tags}
                                coverImage={coverImage}
                                content={content}
                                markdownMode={markdownMode}
                                onTitleChange={setTitle}
                                onDescriptionChange={setDescription}
                                onCategoryChange={setCategory}
                                onAddTag={addTag}
                                onRemoveTag={removeTag}
                                onCoverImageChange={setCoverImage}
                                onContentChange={setContent}
                                onToggleMarkdownMode={setMarkdownMode}
                                titleInputRef={titleInputRef}
                            />
                        </div>

                        <div className={styles.sidebar}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Linked Resources</CardTitle>
                                    <CardDescription>
                                        Attach one or more resources to this article.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className={styles.resourcePickerCard}>
                                    <Popover
                                        open={resourcePickerOpen}
                                        onOpenChange={setResourcePickerOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={styles.resourcePickerTrigger}
                                            >
                                                <span>
                                                    {selectedResourceIds.length > 0
                                                        ? `${selectedResourceIds.length} resources selected`
                                                        : "Select resources"}
                                                </span>
                                                <ChevronDown size={16} />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            align="start"
                                            className={styles.resourcePopover}
                                        >
                                            <div className={styles.resourceSearchWrap}>
                                                <Search
                                                    size={16}
                                                    className={styles.resourceSearchIcon}
                                                />
                                                <Input
                                                    value={resourceSearch}
                                                    onChange={(event) =>
                                                        setResourceSearch(event.target.value)
                                                    }
                                                    placeholder="Search resources..."
                                                    className={styles.resourceSearchInput}
                                                />
                                            </div>

                                            <div className={styles.resourceList}>
                                                {filteredResources.length === 0 ? (
                                                    <div className={styles.resourceEmpty}>
                                                        No matching resources found.
                                                    </div>
                                                ) : (
                                                    filteredResources.map((resource) => {
                                                        const checked =
                                                            selectedResourceIds.includes(
                                                                resource.id
                                                            );

                                                        return (
                                                            <div
                                                                key={resource.id}
                                                                className={styles.resourceOption}
                                                                onClick={() =>
                                                                    toggleResourceSelection(
                                                                        resource.id
                                                                    )
                                                                }
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(event) => {
                                                                    if (
                                                                        event.key === "Enter" ||
                                                                        event.key === " "
                                                                    ) {
                                                                        event.preventDefault();
                                                                        toggleResourceSelection(
                                                                            resource.id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={checked}
                                                                    onCheckedChange={() =>
                                                                        toggleResourceSelection(
                                                                            resource.id
                                                                        )
                                                                    }
                                                                    onClick={(event) =>
                                                                        event.stopPropagation()
                                                                    }
                                                                />

                                                                <div
                                                                    className={
                                                                        styles.resourceOptionBody
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.resourceOptionTop
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            {resource.title}
                                                                        </strong>
                                                                        <span>
                                                                            {resource.provider}
                                                                        </span>
                                                                    </div>
                                                                    <p>
                                                                        {resource.description}
                                                                    </p>
                                                                </div>

                                                                {checked && (
                                                                    <Check
                                                                        size={16}
                                                                        className={
                                                                            styles.resourceCheckIcon
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    {selectedResources.length > 0 && (
                                        <div className={styles.selectedResources}>
                                            {selectedResources.map((resource) => (
                                                <Badge
                                                    key={resource.id}
                                                    variant="secondary"
                                                    className={styles.selectedResourceBadge}
                                                >
                                                    <FolderOpen size={14} />
                                                    <span>{resource.title}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSelectedResource(resource.id)
                                                        }
                                                        className={
                                                            styles.removeResourceButton
                                                        }
                                                        aria-label={`Remove ${resource.title}`}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <PostEditorSidebar
                                wordCount={wordCount}
                                readingTime={readingTime}
                                seoScore={seoScore}
                                status={status}
                                lastSavedAt={lastSavedAt}
                                markdownMode={markdownMode}
                                onSaveDraft={handleSaveDraft}
                                onPreview={handlePreview}
                                onPublish={handlePublish}
                                isSaving={saveMutation.isPending}
                            />
                        </div>
                    </div>
                )}

                {saveMutation.isError && (
                    <div style={{ color: "var(--color-danger, #ef4444)" }}>
                        {(saveMutation.error as Error).message}
                    </div>
                )}
            </div>
        </>
    );
}