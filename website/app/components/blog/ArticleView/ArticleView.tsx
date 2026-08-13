
import { rehypeMermaid, MermaidBlock } from 'react-markdown-mermaid';

import { MarkdownHooks } from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from './ArticleView.module.scss'
import rehypeStarryNight from 'rehype-starry-night'

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\s*\n?/, '')
}

function stripHtmlComments(content: string): string {
  return content.replace(/<!--[\s\S]*?-->/g, '')
}

export default function ArticleView(props: { content: string }) {

  const cleaned = stripHtmlComments(stripFrontmatter(props.content)).replace(/\\`\\`\\`/g, '```')
  return (
    <article className={`markdown-body ${styles.article}`}>
      <MarkdownHooks
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeMermaid, {
            mermaidConfig: {
              theme: 'dark',
              flowchart: { useMaxWidth: true },
            },
          }],
          [rehypeStarryNight]
        ]}
        components={{
          // @ts-expect-error
          MermaidBlock: MermaidBlock,
        }}
        skipHtml={false}
      >
        {cleaned}
      </MarkdownHooks>
    </article>
  )
}