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
                            Add Tag
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
                        <option>React</option>
                        <option>Next.js</option>
                        <option>TypeScript</option>
                        <option>Node.js</option>
                        <option>Security</option>
                        <option>Database</option>
                        <option>AI</option>
                        <option>Cloud</option>
                        <option>Web Development</option>
                    </select>
                </div>
            </div>

            <div className={styles.coverBlock}>
                <label className={styles.label}>Cover Image</label>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = () => {
                            if (typeof reader.result === "string") {
                                onCoverImageChange(reader.result);
                            }
                        };
                        reader.readAsDataURL(file);
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
                        <h2>TipTap Editor</h2>
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
                            Markdown
                        </button>
                    </div>
                </div>

                <RichTextEditor
                    value={content}
                    markdownMode={markdownMode}
                    onChange={onContentChange}
                />

                <div className={styles.bottomBar}>
                    <span>Words update as you type.</span>
                    <span>Use the command palette for quick actions.</span>
                </div>
            </div>
        </motion.section>
    );
}