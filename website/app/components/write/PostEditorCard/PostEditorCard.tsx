import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createSlug } from "~/lib/post-editor";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import styles from "./PostEditorCard.module.scss";

interface PostEditorCardProps {
    title: string;
    description: string;
    category: string;
    tags: string[];
    coverImage: string;
    content: string;
    markdownMode: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
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
                                   category,
                                   tags,
                                   coverImage,
                                   content,
                                   markdownMode,
                                   onTitleChange,
                                   onDescriptionChange,
                                   onCategoryChange,
                                   onAddTag,
                                   onRemoveTag,
                                   onCoverImageChange,
                                   onContentChange,
                                   onToggleMarkdownMode,
                                   titleInputRef,
                               }: PostEditorCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.04 }}
        >
            <div className={styles.titleArea}>
                <Input
                    ref={titleInputRef}
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    className={styles.titleInput}
                    placeholder="Article Title"
                />

                {/*<div className={styles.slugRow}>
                    <span>Slug</span>
                    <code>{slug || "auto-genera"}</code>
                </div>*/}
            </div>

            <div className={styles.metaRow}>
                <div className={styles.metaBlock}>
                    <label className={styles.label}>Tags</label>

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
                            Add
                        </Button>
                    </div>
                </div>

                <div className={styles.categoryBlock}>
                    <label className={styles.label}>Category</label>
                    <select
                        value={category}
                        onChange={(event) => onCategoryChange(event.target.value)}
                        className={styles.select}
                    >
                        <option>Web Development</option>
                        <option>React</option>
                        <option>TypeScript</option>
                        <option>Next.js</option>
                        <option>DevOps</option>
                    </select>
                </div>
            </div>

            <div className={styles.descriptionBlock}>
                <label className={styles.label}>Description</label>
                <textarea
                    value={description}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    className={styles.descriptionInput}
                    placeholder="Write a short summary that explains what this article covers..."
                />
            </div>

            <div className={styles.coverBlock}>
                <label className={styles.label}>Cover Image Upload</label>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const objectUrl = URL.createObjectURL(file);
                        onCoverImageChange(objectUrl);
                    }}
                />

                <button
                    type="button"
                    className={styles.coverUpload}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImagePlus size={18} />
                    <span>{coverImage ? "Change cover image" : "Upload cover image"}</span>
                </button>

                {coverImage && (
                    <div className={styles.coverPreview}>
                        <img src={coverImage} alt="Cover preview" />
                    </div>
                )}
            </div>

            <div className={styles.editorSection}>
                <div className={styles.editorSectionHeader}>
                    <div>
                        <h2>TipTap Editor</h2>
                        <p>Write article here...</p>
                    </div>

                    <div className={styles.modeSwitch}>
                        <Button
                            type="button"
                            className={!markdownMode ? styles.modeActive : ""}
                            onClick={() => onToggleMarkdownMode(false)}
                        >
                            Editor
                        </Button>
                        <Button
                            type="button"
                            className={markdownMode ? styles.modeActive : ""}
                            onClick={() => onToggleMarkdownMode(true)}
                        >
                            Markdown
                        </Button>
                    </div>
                </div>

                <RichTextEditor
                    value={content}
                    markdownMode={markdownMode}
                    onChange={onContentChange}
                />
            </div>

            <div className={styles.bottomBar}>
                <span>Autosave enabled</span>
                <span>Developer publishing workspace</span>
            </div>
        </motion.section>
    );
}