import { useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

    useEditorShortcuts({
        onSaveDraft: saveDraft,
        onPublish: () => publishMutation.mutate(),
        onToggleCommandPalette: () => setCommandPaletteOpen(true),
    });

    useEffect(() => {
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") setCommandPaletteOpen(false);
        };

        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [setCommandPaletteOpen]);

    return (
        <>
            <CommandPalette
                open={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
                onSaveDraft={saveDraft}
                onPreview={() => setMarkdownMode(!markdownMode)}
                onPublish={() => publishMutation.mutate()}
                onFocusTitle={() => titleInputRef.current?.focus()}
                onFocusEditor={() =>
                    editorAnchorRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                onClearDraft={clearDraft}
            />

            <div className={styles.page}>
                <PostEditorHeader />

                <div className={styles.layout}>
                    <motion.div
                        ref={editorAnchorRef}
                        className={styles.main}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                    >
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
                    </motion.div>

                    <div className={styles.sidebar}>
                        <PostEditorSidebar
                            wordCount={wordCount}
                            readingTime={readingTime}
                            seoScore={seoScore}
                            status={status}
                            lastSavedAt={lastSavedAt}
                            markdownMode={markdownMode}
                            onSaveDraft={saveDraft}
                            onPreview={() => setMarkdownMode(!markdownMode)}
                            onPublish={() => publishMutation.mutate()}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}