import { useLayoutEffect, useState } from "react";
import { BarChart3, BookOpen, FolderOpen, Layers3, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { ModuleItem } from "~/lib/constants/modules";
import styles from "./ModulePage.module.scss";
import { fetchResourcesForModule, type ResourceRecord } from "~/lib/api/resources";
import { fetchArticlesForModule, type PublicArticle } from "~/lib/api/articles";
import { ResourceCard } from "~/components/resources/ResourceCard/ResourceCard";
import { ArticleCard } from "~/components/blog/ArticleCard/ArticleCard";
import { DynamicIcon } from "lucide-react/dynamic";

interface ModulePageProps {
    module: ModuleItem;
}

export function ModulePage({ module }: ModulePageProps) {

    const MAX_SHOWN_RESOURCES = 4;
    const [resources, setResources] = useState<ResourceRecord[]>([]);
    const [articles, setArticles] = useState<PublicArticle[]>([]);

    useLayoutEffect(() => {
        (async () => {
            try {
                const data = await fetchResourcesForModule(module.id);
                if (data) setResources(data);
            } catch {
                console.error("Failed to fetch resources for this module.");
            }
        })();
    }, [module]);

    useLayoutEffect(() => {
        (async () => {
            try {
                const data = await fetchArticlesForModule(module.id);
                // setArticles([data[0], data[0], data[0]]);
                setArticles(data)
            } catch {
                console.error("Failed to fetch articles for this module.");
            }
        })();
    }, [module]);

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroIcon}>
                    <DynamicIcon name={module.icon_key ?? "layers-3"} size={32} />
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.topic}>{module.topic}</span>
                    <h1 className={styles.title}>{module.title}</h1>
                    <p className={styles.description}>{module.description}</p>

                    <div className={styles.metaRow}>
                        <span>
                            <BarChart3 size={15} />
                            {module.difficulty}
                        </span>
                    </div>
                </div>
            </section>

            <div className={styles.contentLayout}>
                <div className={styles.mainColumn}>
                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitleRow}>
                                <div className={styles.panelIcon}>
                                    <Layers3 size={16} />
                                </div>
                                <h2>Overview</h2>
                            </div>
                        </CardHeader>

                        <CardContent className={styles.panelBody}>
                            <div className={styles.prose}>
                                {module.overview.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {articles.length > 0 && (
                        <Card className={styles.panel}>
                            <CardHeader className={styles.panelHeader}>
                                <div className={styles.panelTitleRow}>
                                    <div className={styles.panelIcon}>
                                        <Newspaper size={16} />
                                    </div>
                                    <h2>Articles</h2>
                                </div>
                            </CardHeader>
                            <CardContent className={styles.panelBody}>
                                <div className={styles.articleGrid}>
                                    {articles.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            id={article.slug}
                                            title={article.title}
                                            excerpt={article.excerpt ?? ""}
                                            image={article.cover_image ?? "/logo.png"}
                                            author={article.author_name ?? "CorkAirportDojo"}
                                            authorAvatarUrl={article.author_avatar_url}
                                            date={new Intl.DateTimeFormat("en-IE", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }).format(new Date(article.created_at))}
                                            readTime={article.read_time ?? ""}
                                            resourceCount={article.resources?.length ?? 0}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className={styles.rail}>
                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitleRow}>
                                <div className={styles.panelIcon}>
                                    <BookOpen size={16} />
                                </div>
                                <h2>Module Details</h2>
                            </div>
                        </CardHeader>

                        <CardContent className={styles.panelBody}>
                            <div className={styles.detailList}>
                                <div className={styles.detailItem}>
                                    <strong>Topic</strong>
                                    <span>{module.topic}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Difficulty</strong>
                                    <span>{module.difficulty}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {resources.length > 0 && <Card>
                        <CardHeader>
                            <div className={styles.panelHeader}>
                                <div className={styles.panelTitleRow}>
                                    <div className={styles.panelIcon}>
                                        <FolderOpen size={16} />
                                    </div>
                                    <h2>Module Resources</h2>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            {
                                resources ?
                                    <>
                                        <div>
                                            {resources.slice(0, MAX_SHOWN_RESOURCES).map((resource, i) => (
                                                <ResourceCard key={i} resource={resource} />
                                            ))}
                                        </div>


                                        {resources.length > MAX_SHOWN_RESOURCES ? <span className="opacity-60">
                                            {Math.min(4, resources.length)} of {resources.length} resources
                                        </span> : <></>}
                                    </>
                                    : <p>No resources</p>
                            }

                        </CardContent>
                    </Card>}
                </aside>
            </div>
        </div>
    );
}