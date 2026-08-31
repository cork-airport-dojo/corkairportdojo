import { useEffect, useRef, useState, useLayoutEffect } from "react";
import styles from "./RichTextEditor.module.scss";
import ArticleView from "~/components/blog/ArticleView/ArticleView";

interface RichTextEditorProps {
  value: string;
  markdownMode: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  markdownMode,
  onChange,
  placeholder = "",
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onChange(content);
  }, [content, onChange]);

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
      <div className={styles.editorBody}>
        <textarea
          placeholder={placeholder}
          className={styles.editorTextArea}
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value ?? "")}
        ></textarea>
      </div>
    </div>
  );
}
