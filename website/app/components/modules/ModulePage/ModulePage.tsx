import { useLayoutEffect, useState } from "react";
import { BarChart3, FolderOpen, Grid, Layers3, List, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { ModuleItem } from "~/lib/constants/modules";
import styles from "./ModulePage.module.scss";
import { fetchResourcesForModule, type ResourceRecord } from "~/lib/api/resources";
import { fetchArticlesForModule, type PublicArticle } from "~/lib/api/articles";
import { ResourceCard } from "~/components/resources/ResourceCard/ResourceCard";
import { ArticleCard } from "~/components/blog/ArticleCard/ArticleCard";
import { DynamicIcon } from "lucide-react/dynamic";
import { Switch } from "~/components/ui/switch";
import { PaginationControls } from "~/components/ui/pagination";

interface ModulePageProps {
    module: ModuleItem;
}

const PAGE_SIZE = 6;

export function ModulePage({ module }: ModulePageProps) {

    const [resources, setResources] = useState<ResourceRecord[]>([]);
    const [articles, setArticles] = useState<PublicArticle[]>([]);
    const [isArticleListView, setIsArticleListView] = useState(false);
    const [isResourceListView, setIsResourceListView] = useState(false);
    const [articlePage, setArticlePage] = useState(1);
    const [resourcePage, setResourcePage] = useState(1);

    // Reset pages when module changes
    useLayoutEffect(() => {
        setArticlePage(1);
        setResourcePage(1);
    }, [module.id]);

    useLayoutEffect(() => {
        (async () => {
            try {
                const data = await fetchArticlesForModule(module.id, {
                    page: articlePage,
                    pageSize: PAGE_SIZE,
                });
                setArticles(data);
            } catch {
                console.error("Failed to fetch articles for this module.");
            }
        })();
    }, [articlePage, module.id]);

    useLayoutEffect(() => {
        (async () => {
            try {
                const data = await fetchResourcesForModule(module.id, {
                    page: resourcePage,
                    pageSize: PAGE_SIZE,
                });
                if (data) setResources(data);
                console.log({data})
            } catch {
                console.error("Failed to fetch resources for this module.");
            }
        })();
    }, [resourcePage, module.id]);

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

            {/* <aside className={styles.rail}>
                <Card className={styles.panel}>
                    <CardHeader className={styles.panelHeader}>
                        <div className={styles.panelTitle}>
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
            </aside> */}

            <div className={styles.contentLayout}>
                <div className={styles.mainColumn}>
                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitle}>
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
                                    <div className={styles.panelTitle}>
                                        <div className={styles.panelIcon}>
                                            <Newspaper size={16} />
                                        </div>
                                        <h2>Articles</h2>
                                    </div>
                                    <div className={styles.toggleView}>
                                        <Grid size={16} />
                                        <Switch
                                            checked={isArticleListView}
                                            onCheckedChange={setIsArticleListView}
                                        />
                                        <List size={16} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className={styles.panelBody}>
                                <div className={isArticleListView ? styles.articleList : styles.articleGrid}>
                                    {articles.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            id={article.slug}
                                            title={article.title}
                                            excerpt={article.excerpt ?? ""}
                                            image={article.cover_image ?? "/logo.webp"}
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
                                <PaginationControls
                                    className={styles.pagination}
                                    currentPage={articlePage}
                                    itemCount={articles.length}
                                    pageSize={PAGE_SIZE}
                                    onPageChange={setArticlePage}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {resources.length > 0 && (
                        <Card className={styles.panel}>
                            <CardHeader className={styles.panelHeader}>
                                <div className={styles.panelTitleRow}>
                                    <div className={styles.panelTitle}>
                                        <div className={styles.panelIcon}>
                                            <FolderOpen size={16} />
                                        </div>
                                        <h2>Resources</h2>
                                    </div>
                                    <div className={styles.toggleView}>
                                        <Grid size={16} />
                                        <Switch
                                            checked={isResourceListView}
                                            onCheckedChange={setIsResourceListView}
                                        />
                                        <List size={16} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className={styles.panelBody}>
                                <div className={isResourceListView ? styles.resourceList : styles.resourceGrid}>
                                    {resources.map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                                <PaginationControls
                                    className={styles.pagination}
                                    currentPage={resourcePage}
                                    itemCount={resources.length}
                                    pageSize={PAGE_SIZE}
                                    onPageChange={setResourcePage}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
