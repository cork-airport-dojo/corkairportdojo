import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    FileText,
    Focus,
    Save,
    Search,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";
import styles from "./CommandPalette.module.scss";

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
}

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
    onSaveDraft: () => void;
    onPreview: () => void;
    onPublish: () => void;
    onFocusTitle: () => void;
    onFocusEditor: () => void;
    onClearDraft: () => void;
}

export function CommandPalette({
                                   open,
                                   onClose,
                                   onSaveDraft,
                                   onPreview,
                                   onPublish,
                                   onFocusTitle,
                                   onFocusEditor,
                                   onClearDraft,
                               }: CommandPaletteProps) {
    const [query, setQuery] = useState("");

    const commands = useMemo<CommandItem[]>(
        () => [
            {
                id: "save",
                label: "Save draft",
                icon: <Save size={16} />,
                action: onSaveDraft,
            },
            {
                id: "preview",
                label: "Preview post",
                icon: <Eye size={16} />,
                action: onPreview,
            },
            {
                id: "publish",
                label: "Publish post",
                icon: <Upload size={16} />,
                action: onPublish,
            },
            {
                id: "title",
                label: "Focus title",
                icon: <Focus size={16} />,
                action: onFocusTitle,
            },
            {
                id: "editor",
                label: "Focus editor",
                icon: <FileText size={16} />,
                action: onFocusEditor,
            },
            {
                id: "clear",
                label: "Clear draft",
                icon: <Trash2 size={16} />,
                action: onClearDraft,
            },
        ],
        [onClearDraft, onFocusEditor, onFocusTitle, onPreview, onPublish, onSaveDraft]
    );

    const filtered = commands.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (!open) setQuery("");
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className={styles.palette}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                    >
                        <div className={styles.searchRow}>
                            <Search size={18} />
                            <input
                                autoFocus
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search commands..."
                                className={styles.searchInput}
                            />
                            <span className={styles.shortcut}>ESC</span>
                        </div>

                        <div className={styles.commandList}>
                            {filtered.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={styles.commandItem}
                                    onClick={() => {
                                        item.action();
                                        onClose();
                                    }}
                                >
                                    <span className={styles.commandIcon}>{item.icon}</span>
                                    <span className={styles.commandLabel}>{item.label}</span>
                                    <Sparkles size={14} className={styles.commandHint} />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}