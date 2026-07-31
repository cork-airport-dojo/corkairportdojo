
import { rehypeMermaid, MermaidBlock } from 'react-markdown-mermaid';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from './ArticleView.module.scss'

export default function ArticleView(props: { content: string }) {


    console.error(props.content)
    const cleaned = props.content.replace(/\\`\\`\\`/g, '```')


    return (
        <article className={`markdown-body ${styles.article}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    [rehypeMermaid, {
                        mermaidConfig: {
                            theme: 'default',
                            flowchart: { useMaxWidth: true },
                        },
                    }],
                ]}
                components={{
                    // @ts-ignore
                    MermaidBlock: MermaidBlock,
                }}
                skipHtml={false}
            >
                {cleaned}
            </ReactMarkdown>
        </article>
    )
}