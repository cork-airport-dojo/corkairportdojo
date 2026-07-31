import { useEffect, useState } from "react";
import { Clock3, FolderOpen } from "lucide-react";
import { ArticleResourcesAside } from "~/components/resources/ArticleResourcesAside/ArticleResourcesAside";
import { useRecentArticlesStore } from "~/store/use-recent-articles-store";
import styles from "./ArticlePage.module.scss";
import { fetchModuleById, type PublicModule } from "~/lib/api/modules";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import ArticleView from "../ArticleView/ArticleView";

export interface ArticleLinkedResource {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
}

export interface ArticlePagePost {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    authorAvatarUrl?: string | null;
    date: string;
    slug: string;
    readTime: string;
    image: string;
    featured?: boolean;
    resources?: ArticleLinkedResource[];
    markdown?: string;
    moduleId?: string;
}

interface ArticlePageProps {
    post: ArticlePagePost;
}

export function ArticlePage({ post }: ArticlePageProps) {
    const linkedResources = post.resources ?? [];
    const { addArticle } = useRecentArticlesStore();
    const [module, setModule] = useState<PublicModule | undefined>(undefined)

    useEffect(() => {
        addArticle({
            id: post.id,
            title: post.title,
            href: `/blog/${post.id}`,
        });

        if (post.moduleId !== undefined) {
            (async () => {
                setModule(await fetchModuleById(post.moduleId!) ?? undefined)
            })()
        }

    }, [addArticle, post.id, post.title]);

    return (
        <div className={styles.page}>

            {module &&
                <div>
                    {/* <span className={styles.badge}> */}
                    <Button size="sm" className="p-0" variant="link">
                        <Link to={`/modules/${module.slug}`}>{module.title}</Link>
                    </Button>
                    {/* </span> */}
                    /{post.slug}
                </div>

            }
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{post.title}</h1>

                    <div className={styles.coverCard}>
                        {post.image ?
                            <img
                                src={post.image}
                                alt={post.title}
                                className={styles.coverImage}
                                onError={(event) => {
                                    event.currentTarget.src = "/logo.png";
                                }}
                            />
                            : <></>}
                    </div>

                    <p className={styles.excerpt}>{post.excerpt}</p>

                    <div className={styles.metaRow}>
                        <div className={styles.authorRow}>
                            <img
                                src={post.authorAvatarUrl || "/logo.png"}
                                alt={post.author}
                                className={styles.avatar}
                                onError={(event) => {
                                    event.currentTarget.src = "/logo.png";
                                }}
                            />
                            <div className={styles.authorMeta}>
                                <strong>{post.author}</strong>
                                <span>{post.date}</span>
                            </div>
                        </div>

                        <div className={styles.metaGroup}>
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
                </div>
            </section>

            <div className={styles.layout}>
                <main className={styles.main}>
                    <ArticleView content={post.markdown ?? ""} />
                </main>

                <aside className={styles.aside}>
                    {linkedResources.length > 0 && <ArticleResourcesAside resources={linkedResources} />}
                </aside>
            </div>
        </div>
    );
}