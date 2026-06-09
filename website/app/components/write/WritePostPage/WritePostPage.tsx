import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import styles from "./WritePostPage.module.scss";

export function WritePostPage() {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [content, setContent] = useState("");

    const readingStats = useMemo(() => {
        const plainText = `${title} ${excerpt} ${content}`
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const wordCount = plainText ? plainText.split(" ").length : 0;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        return {
            wordCount,
            readTime,
        };
    }, [title, excerpt, content]);

    return (
        <section className={styles.page}>
            <div className={styles.topBar}>
                <div>
                    <p className={styles.eyebrow}>Editor</p>
                    <h1 className={styles.title}>Write a Post</h1>
                    <p className={styles.subtitle}>
                        Create a polished article with structured content, metadata, and
                        publishing controls.
                    </p>
                </div>

                <div className={styles.topActions}>
                    <Button variant="outline" className={styles.secondaryAction}>
                        Save Draft
                    </Button>
                    <Button variant="outline" className={styles.secondaryAction}>
                        Preview
                    </Button>
                    <Button className={styles.primaryAction}>Publish Post</Button>
                </div>
            </div>

            <div className={styles.layout}>
                <div className={styles.main}>
                    <div className={styles.editorCard}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Post Title</label>
                            <Input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Enter your post title..."
                                className={styles.titleInput}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Excerpt</label>
                            <textarea
                                value={excerpt}
                                onChange={(event) => setExcerpt(event.target.value)}
                                placeholder="Write a short summary for your post..."
                                className={styles.excerptInput}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Content</label>
                            <RichTextEditor value={content} onChange={setContent} />
                        </div>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.sideCard}>
                        <h2>Post Settings</h2>

                        <div className={styles.sideField}>
                            <label className={styles.label}>Category</label>
                            <Input
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                placeholder="e.g. React"
                                className={styles.sideInput}
                            />
                        </div>

                        <div className={styles.sideField}>
                            <label className={styles.label}>Tags</label>
                            <Input
                                value={tags}
                                onChange={(event) => setTags(event.target.value)}
                                placeholder="e.g. react, typescript, architecture"
                                className={styles.sideInput}
                            />
                        </div>

                        <div className={styles.sideField}>
                            <label className={styles.label}>Cover Image URL</label>
                            <Input
                                value={coverImage}
                                onChange={(event) => setCoverImage(event.target.value)}
                                placeholder="https://example.com/cover.jpg"
                                className={styles.sideInput}
                            />
                        </div>
                    </div>

                    <div className={styles.sideCard}>
                        <h2>Post Stats</h2>

                        <div className={styles.statsList}>
                            <div className={styles.statRow}>
                                <span>Words</span>
                                <strong>{readingStats.wordCount}</strong>
                            </div>

                            <div className={styles.statRow}>
                                <span>Read Time</span>
                                <strong>{readingStats.readTime} min</strong>
                            </div>

                            <div className={styles.statRow}>
                                <span>Status</span>
                                <strong>Draft</strong>
                            </div>
                        </div>
                    </div>

                    {coverImage && (
                        <div className={styles.sideCard}>
                            <h2>Cover Preview</h2>
                            <div className={styles.coverPreview}>
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}