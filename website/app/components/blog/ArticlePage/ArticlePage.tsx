import { useEffect } from "react";
import { Clock3, FolderOpen } from "lucide-react";
import { resources } from "~/lib/constants/resources";
import { ArticleResourcesAside } from "~/components/resources/ArticleResourcesAside/ArticleResourcesAside";
import { useRecentArticlesStore } from "~/store/use-recent-articles-store";
import styles from "./ArticlePage.module.scss";

export interface ArticlePagePost {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
    resourceIds?: string[];
    body: string[];
}

interface ArticlePageProps {
    post: ArticlePagePost;
}

export function ArticlePage({ post }: ArticlePageProps) {
    const linkedResources = resources.filter((resource) =>
        post.resourceIds?.includes(resource.id)
    );

    const { addArticle } = useRecentArticlesStore();

    useEffect(() => {
        addArticle({
            id: post.id,
            title: post.title,
            category: post.category,
            href: `/blog/${post.id}`,
        });
    }, [addArticle, post.id, post.title, post.category]);

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.category}>{post.category}</span>
                    <h1 className={styles.title}>{post.title}</h1>
                    <p className={styles.excerpt}>{post.excerpt}</p>

                    <div className={styles.metaRow}>
                        <div className={styles.authorRow}>
                            <img src="/avatar.jpg" alt={post.author} className={styles.avatar} />
                            <div className={styles.authorMeta}>
                                <strong>{post.author}</strong>
                                <span>{post.date}</span>
                            </div>
                        </div>

                        <div className={styles.readMeta}>
                            <Clock3 size={15} />
                            <span>{post.readTime}</span>
                        </div>

                        <div className={styles.resourceMeta}>
                            <FolderOpen size={15} />
                            <span>{linkedResources.length} resources</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.coverWrap}>
                <img
                    src={post.image}
                    alt={post.title}
                    className={styles.coverImage}
                    onError={(event) => {
                        event.currentTarget.src = "/logo.png";
                    }}
                />
            </div>

            <div className={styles.layout}>
                <main className={styles.main}>
                    <article className={styles.article}>
                        {post.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </article>
                </main>

                <aside className={styles.aside}>
                    <ArticleResourcesAside resources={linkedResources} />
                </aside>
            </div>
        </div>
    );
}