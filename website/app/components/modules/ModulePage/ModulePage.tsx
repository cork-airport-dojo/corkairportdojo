import { useEffect } from "react";
import { BarChart3, BookOpen, Eye, Layers3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { ModuleItem } from "~/lib/constants/modules";
import { useModuleViewsStore } from "~/store/use-module-views-store";
import styles from "./ModulePage.module.scss";

interface ModulePageProps {
    module: ModuleItem;
}

export function ModulePage({ module }: ModulePageProps) {
    const { hydrate, incrementView, getViews } = useModuleViewsStore();

    useEffect(() => {
        hydrate();
        incrementView(module.id);
    }, [hydrate, incrementView, module.id]);

    const Icon = module.icon;
    const totalViews = getViews(module.id, module.views);

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroIcon}>
                    <Icon size={32} />
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.topic}>{module.topic}</span>
                    <h1 className={styles.title}>{module.title}</h1>
                    <p className={styles.description}>{module.description}</p>

                    <div className={styles.metaRow}>
                        <span>
                            <BookOpen size={15} />
                            {module.lessons} lessons
                        </span>
                        <span>
                            <BarChart3 size={15} />
                            {module.difficulty}
                        </span>
                        <span>
                            <Eye size={15} />
                            {totalViews} views
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
                                <div className={styles.detailItem}>
                                    <strong>Lessons</strong>
                                    <span>{module.lessons}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Views</strong>
                                    <span>{totalViews}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}