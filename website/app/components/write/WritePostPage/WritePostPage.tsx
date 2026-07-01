import { useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    calculateReadingTime,
    calculateSeoScore,
    calculateWordCount,
} from "~/lib/post-editor";
import { usePostEditorStore } from "~/store/use-post-editor-store";
import { useEditorShortcuts } from "~/hooks/use-editor-shortcuts";
import { PostEditorHeader } from "../PostEditorHeader/PostEditorHeader";
import { PostEditorCard } from "../PostEditorCard/PostEditorCard";
import { PostEditorSidebar } from "../PostEditorSidebar/PostEditorSidebar";
import { CommandPalette } from "../CommandPalette/CommandPalette";
import styles from "./WritePostPage.module.scss";

async function fakePublishRequest() {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { success: true };
}

export function WritePostPage() {
    const titleInputRef = useRef<HTMLInputElement>(null);
    const editorAnchorRef = useRef<HTMLDivElement>(null);

    const {
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

    const wordCount = useMemo(() => {
        return calculateWordCount(`${title} ${description} ${content}`);
    }, [title, description, content]);

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

    const publishMutation = useMutation({
        mutationFn: fakePublishRequest,
        onSuccess: () => {
            setStatus("published");
            saveDraft();
        },
    });

    const handlePreview = () => setMarkdownMode(!markdownMode);
    const handlePublish = () => publishMutation.mutate();
    const handleOpenCommandPalette = () => setCommandPaletteOpen(true);
    const handleCloseCommandPalette = () => setCommandPaletteOpen(false);

    useEditorShortcuts({
        onSaveDraft: saveDraft,
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
                onSaveDraft={saveDraft}
                onPreview={handlePreview}
                onPublish={handlePublish}
                onFocusTitle={() => titleInputRef.current?.focus()}
                onFocusEditor={() =>
                    editorAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
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
                            onSaveDraft={saveDraft}
                            onPreview={handlePreview}
                            onPublish={handlePublish}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}