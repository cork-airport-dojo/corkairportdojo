import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createSlug } from "~/lib/post-editor";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import styles from "./PostEditorCard.module.scss";

interface PostEditorCardProps {
    title: string;
    description: string;
    tags: string[];
    coverImage: string;
    content: string;
    markdownMode: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onAddTag: (value: string) => void;
    onRemoveTag: (value: string) => void;
    onCoverImageChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onToggleMarkdownMode: (value: boolean) => void;
    titleInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function PostEditorCard({
    title,
    description,
    tags,
    coverImage,
    content,
    markdownMode,
    onTitleChange,
    onDescriptionChange,
    onAddTag,
    onRemoveTag,
    onCoverImageChange,
    onContentChange,
    onToggleMarkdownMode,
    titleInputRef,
}: PostEditorCardProps) {
    const [tagInput, setTagInput] = useState("");
    const slug = createSlug(title);

    const handleTagSubmit = () => {
        if (!tagInput.trim()) return;
        onAddTag(tagInput);
        setTagInput("");
    };

    return (
        <motion.section
            className={styles.card}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: 0.04 }}
        >
            <div className={styles.titleArea}>
                <div className={styles.fieldBlock}>
                    <label className={styles.fieldLabel}>Title</label>
                    <Input
                        ref={titleInputRef}
                        value={title}
                        onChange={(event) => onTitleChange(event.target.value)}
                        className={styles.titleInput}
                        placeholder="Add your title here..."
                    />
                </div>

                <div className={styles.slugRow}>
                    <span>Slug</span>
                    <code>{slug || "your-post-slug"}</code>
                </div>
            </div>

            <div className={styles.descriptionBlock}>
                <label className={styles.label}>
                    Description <span>Appears in search results and previews</span>
                </label>
                <textarea
                    value={description}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    placeholder="Write a short description of your article..."
                    className={styles.descriptionInput}
                />
            </div>

            <div className={styles.metaRow}>
                <div className={styles.metaBlock}>
                    <label className={styles.label}>Tags</label>



                    <div className={styles.tagInputRow}>
                        <Input
                            value={tagInput}
                            onChange={(event) => setTagInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleTagSubmit();
                                }
                            }}
                            placeholder="Add a tag..."
                            className={styles.metaInput}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className={styles.metaButton}
                            onClick={handleTagSubmit}
                        >
                            Add Tag
                        </Button>
                    </div>

                    <div className={styles.tagList}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles.tagChip}>
                                {tag}
                                <button type="button" onClick={() => onRemoveTag(tag)}>
                                    <X size={13} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            <div className={styles.coverBlock}>
                <label className={styles.label}>Cover Image</label>
                <p className={styles.helpText}>
                    Paste a URL to a wide banner-style image. Avoid screenshots with small text,
                    dashboards, or dense UI captures, as they can look blurry and oversized on the
                    article page.
                </p>

                <Input
                    value={coverImage}
                    onChange={(event) => onCoverImageChange(event.target.value)}
                    placeholder="https://example.com/image.png"
                    className={styles.coverUrlInput}
                />

                <div className={styles.coverPreview}>
                    {coverImage ? (
                        <img src={coverImage} alt="Cover preview" />
                    ) : (
                        <div className={styles.coverEmpty}>No image selected</div>
                    )}
                </div>
            </div>

            <div className={styles.editorSection}>
                <div className={styles.editorSectionHeader}>
                    <div>
                        <h2>Article Body</h2>
                        <p>Write your article using the structured editor or preview markdown.</p>
                    </div>

                    <div className={styles.modeSwitch}>
                        <button
                            type="button"
                            className={!markdownMode ? styles.modeActive : ""}
                            onClick={() => onToggleMarkdownMode(false)}
                        >
                            Editor
                        </button>
                        <button
                            type="button"
                            className={markdownMode ? styles.modeActive : ""}
                            onClick={() => onToggleMarkdownMode(true)}
                        >
                           Preview 
                        </button>
                    </div>
                </div>

                <RichTextEditor
                    value={content}
                    markdownMode={markdownMode}
                    onChange={onContentChange}
                />
            </div>
        </motion.section>
    );
}