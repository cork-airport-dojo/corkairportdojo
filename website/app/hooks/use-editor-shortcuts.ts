import { useEffect } from "react";

interface EditorShortcutsOptions {
    onSaveDraft: () => void;
    onPublish: () => void;
    onToggleCommandPalette: () => void;
}

export function useEditorShortcuts({
                                       onSaveDraft,
                                       onPublish,
                                       onToggleCommandPalette,
                                   }: EditorShortcutsOptions) {
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            const meta = event.metaKey || event.ctrlKey;

            if (meta && event.key.toLowerCase() === "s") {
                event.preventDefault();
                onSaveDraft();
            }

            if (meta && event.key.toLowerCase() === "k") {
                event.preventDefault();
                onToggleCommandPalette();
            }

            if (meta && event.key === "Enter") {
                event.preventDefault();
                onPublish();
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [onPublish, onSaveDraft, onToggleCommandPalette]);
}