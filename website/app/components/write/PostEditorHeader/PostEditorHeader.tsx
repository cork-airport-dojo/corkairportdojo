import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import styles from "./PostEditorHeader.module.scss";

interface PostEditorHeaderProps {
    isEditMode?: boolean;
}

export function PostEditorHeader({
                                     isEditMode = false,
                                 }: PostEditorHeaderProps) {
    return (
        <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
        >
            <div className={styles.left}>
                <div className={styles.iconWrap}>
                    <FileText size={17} />
                </div>

                <div className={styles.textBlock}>
                    <span className={styles.eyebrow}>Article Editor</span>
                    <h1>{isEditMode ? "Edit Article" : "Create New Article"}</h1>
                    <p>
                        {isEditMode
                            ? "Update article content, metadata and publish state."
                            : "Create and publish articles for the CorkAirportDojo community."}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}