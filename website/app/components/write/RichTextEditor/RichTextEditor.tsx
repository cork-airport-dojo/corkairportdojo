import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
    Bold,
    Heading1,
    Heading2,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo2,
    RemoveFormatting,
    Strikethrough,
    Undo2,
    Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import styles from "./RichTextEditor.module.scss";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Placeholder.configure({
                placeholder: "Start writing your post...",
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("Enter link URL", previousUrl);

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className={styles.editorShell}>
            <div className={styles.toolbar}>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough size={16} />
                </Button>

                <div className={styles.divider} />

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >
                    <Heading1 size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    <Heading2 size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={setLink}
                >
                    <LinkIcon size={16} />
                </Button>

                <div className={styles.divider} />

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                >
                    <RemoveFormatting size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 size={16} />
                </Button>
            </div>

            <div className={styles.editorBody}>
                <EditorContent editor={editor} className={styles.editorContent} />
            </div>
        </div>
    );
}