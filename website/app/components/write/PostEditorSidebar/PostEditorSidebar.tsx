import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import styles from "./PostEditorSidebar.module.scss";

interface PostEditorSidebarProps {
    wordCount: number;
    readingTime: number;
    seoScore: number;
    status: "draft" | "review" | "published";
    lastSavedAt: string | null;
    markdownMode: boolean;
    onSaveDraft: () => void;
    onPreview: () => void;
    onPublish: () => void;
}

export function PostEditorSidebar({
                                      wordCount,
                                      readingTime,
                                      seoScore,
                                      status,
                                      lastSavedAt,
                                      markdownMode,
                                      onSaveDraft,
                                      onPreview,
                                      onPublish,
                                  }: PostEditorSidebarProps) {
    return (
        <motion.aside
            className={styles.sidebar}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
        >
            <div className={styles.card}>
                <h2>Post Settings</h2>

                <div className={styles.metricStack}>
                    <div className={styles.metric}>
                        <span>SEO Score</span>
                        <strong>{seoScore}/100</strong>
                    </div>

                    <div className={styles.metric}>
                        <span>Reading Time</span>
                        <strong>{readingTime} min</strong>
                    </div>

                    <div className={styles.metric}>
                        <span>Word Count</span>
                        <strong>{wordCount}</strong>
                    </div>

                    <div className={styles.metric}>
                        <span>Status</span>
                        <strong className={styles.status}>{status}</strong>
                    </div>

                    <div className={styles.metric}>
                        <span>Mode</span>
                        <strong>{markdownMode ? "Markdown" : "Editor"}</strong>
                    </div>
                </div>

                <div className={styles.savedRow}>
                    <span>Last saved</span>
                    <strong>
                        {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : "Not saved"}
                    </strong>
                </div>
            </div>

            <div className={styles.card}>
                <h2>Publish</h2>

                <div className={styles.actionStack}>
                    <Button
                        type="button"
                        variant="outline"
                        className={styles.secondaryButton}
                        onClick={onSaveDraft}
                    >
                        Save Draft
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className={styles.secondaryButton}
                        onClick={onPreview}
                    >
                        Preview
                    </Button>

                    <Button
                        type="button"
                        className={styles.primaryButton}
                        onClick={onPublish}
                    >
                        Publish Post
                    </Button>
                </div>
            </div>
        </motion.aside>
    );
}