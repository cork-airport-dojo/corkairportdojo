import { useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Bold,
    Code2,
    Heading1,
    Heading2,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import styles from "./RichTextEditor.module.scss";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
    value: string;
    markdownMode: boolean;
    onChange: (value: string) => void;
}

export function RichTextEditor({
                                   value,
                                   markdownMode,
                                   onChange,
                               }: RichTextEditorProps) {
    const markdownPreview = useMemo(() => {
        return value
            .replace(/<h1>(.*?)<\/h1>/g, "# $1")
            .replace(/<h2>(.*?)<\/h2>/g, "## $1")
            .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
            .replace(/<em>(.*?)<\/em>/g, "*$1*")
            .replace(/<code>(.*?)<\/code>/g, "`$1`")
            .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/<[^>]*>/g, "");
    }, [value]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Underline,
            Image,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Placeholder.configure({
                placeholder: "Write your article here...",
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (markdownMode) {
        return (
            <div className={styles.editorShell}>
                <div className={styles.previewWrap}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdownPreview}
                    </ReactMarkdown>
                </div>
            </div>
        );
    }

    if (!editor) return null;

    const setLink = () => {
        const previous = editor.getAttributes("link").href;
        const url = window.prompt("Enter URL", previous);

        if (url === null) return;

        if (!url) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL");
        if (!url) return;
        editor.chain().focus().setImage({ src: url }).run();
    };

    return (
        <div className={styles.editorShell}>
            <div className={styles.toolbar}>
                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={setLink}
                >
                    <Link2 size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={addImage}
                >
                    <ImagePlus size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={16} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Code2 size={16} />
                </Button>
            </div>

            <div className={styles.editorBody}>
                <EditorContent editor={editor} className={styles.editorContent} />
            </div>
        </div>
    );
}