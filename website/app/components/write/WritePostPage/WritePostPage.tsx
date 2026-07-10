import { useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
import { uploadArticleCoverImage } from "~/lib/api/storage";
import { dataUrlToFile } from "~/lib/image";
import { useAuthStore } from "~/store/use-auth-store";
import { usePostEditorStore } from "~/store/use-post-editor-store";
import { useEditorShortcuts } from "~/hooks/use-editor-shortcuts";
import { PostEditorHeader } from "../PostEditorHeader/PostEditorHeader";
import { PostEditorCard } from "../PostEditorCard/PostEditorCard";
import { PostEditorSidebar } from "../PostEditorSidebar/PostEditorSidebar";
import { CommandPalette } from "../CommandPalette/CommandPalette";
import styles from "./WritePostPage.module.scss";


function htmlToParagraphs(content: string) {
    return content
        .split(/\n{2,}/)
        .map((chunk) => chunk.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())
        .filter(Boolean);
}

export function WritePostPage() {
    const navigate = useNavigate();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const editorAnchorRef = useRef<HTMLDivElement>(null);

    const { user, userName } = useAuthStore();

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
        loadDraft,
        clearDraft,
        setCommandPaletteOpen,
        setArticleIdentity,
    } = usePostEditorStore();

    useEffect(() => {
        loadDraft();
    }, [loadDraft]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            saveDraft();
        }, 1200);

        return () => window.clearTimeout(timeout);
    }, [
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
                cover_image: resolvedCoverImage,
                read_time: `${readingTime} min read`,
                featured: false,
                published,
            };

            if (articleId) {
                return updateArticleRequest({
                    id: articleId,
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
                <PostEditorHeader />

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

                {saveMutation.isError && (
                    <div style={{ color: "var(--color-danger, #ef4444)" }}>
                        {(saveMutation.error as Error).message}
                    </div>
                )}
            </div>
        </>
    );
}