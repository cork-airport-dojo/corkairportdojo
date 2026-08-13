import { useEffect, useRef, useState, useLayoutEffect } from "react";
import styles from "./RichTextEditor.module.scss";
import ArticleView from "~/components/blog/ArticleView/ArticleView";

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

    useLayoutEffect(() => {
        setContent(value ?? "")
    }, [value])

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