import { motion } from "framer-motion";
import { PenTool, CopyPlus } from "lucide-react";
import styles from "./PostEditorHeader.module.scss";

export function PostEditorHeader() {
    return (
        <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className={styles.left}>
                <div className={styles.iconWrap}>
                    <PenTool size={17} />
                </div>

                <div className={styles.textBlock}>
                    <h1>Create New Article</h1>
                </div>
            </div>

            <button
                type="button"
                className={styles.utilityButton}
                aria-label="Duplicate article"
            >
                <CopyPlus size={17} />
            </button>
        </motion.div>
    );
}