import { useMemo, useEffect, useRef, useState, useLayoutEffect } from "react";
import { common, createLowlight } from "lowlight";
import { Button } from "~/components/ui/button";
import styles from "./RichTextEditor.module.scss";
import ArticleView from "~/components/blog/ArticleView/ArticleView";
import RichTextToolbar from "./RichTextToolbar";

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

    const [content, setContent] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)



    const markdownPreview = useMemo(() => {
        if (value === null) return null
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

    const isInternalChange = useRef(false);

    // const editor = useEditor({
    //     extensions: [
    //         StarterKit.configure()
    //         // Document,
    //         // Text,
    //         // TableKit,
    //         // @ts-ignore
    //         // Markdown.configure({type: "Markdown"}),
    //         // Underline,
    //         // Image,
    //         // TextAlign.configure({
    //         //     types: ["heading", "paragraph"],
    //         // }),
    //         // Link.configure({
    //             // openOnClick: false,
    //             // autolink: true,
    //         // }),
    //         // Placeholder.configure({
    //             // placeholder: "Start writing your article here...",
    //         // }),
    //         // CodeBlockLowlight.configure({
    //         //     lowlight,
    //         //     enableTabIndentation: true,
    //         // }),
    //     ],
    //     content: value,
    //     parseOptions: {
    //         preserveWhitespace: 'full',
    //     },
    //     immediatelyRender: true,
    //     onUpdate: ({ editor }) => {
    //         isInternalChange.current = true;
    //         // onChange(editor.getMarkdown());
    //         console.error(editor.getText())
    //         onChange(editor.getText())
    //     },
    // });

    // useEffect(() => {
    //     if (!editor) return;
    //     if (isInternalChange.current) {
    //         isInternalChange.current = false;
    //         return;
    //     }
    //     editor.commands.setContent(value, {parseOptions: {preserveWhitespace: 'full'}});
    // }, [editor, value]);

    useLayoutEffect(() => {
        setContent(value ?? "")
    }, [])

    useEffect(() => {onChange(content)}, [content])

    if (markdownMode) {
        return (
            <div className={styles.editorShell}>
                <div className={styles.previewWrap}>
                    <ArticleView content={content ?? ""} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editorShell}>
            {/* <RichTextToolbar editor={editor} /> */}

            <div className={styles.editorBody}>
                {/* <div className={styles.editorContent}> */}
                    <textarea
                        className={styles.editorTextArea}
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value ?? "")}
                    >
                    </textarea>
                    {/* <EditorContent editor={editor} /> */}
                </div>
            {/* </div> */}
        </div>
    );
}