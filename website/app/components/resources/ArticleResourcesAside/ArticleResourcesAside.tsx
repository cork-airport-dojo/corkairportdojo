import { ExternalLink, FolderOpen } from "lucide-react";
import type {ResourceItem} from "~/lib/constants/resources";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import styles from "./ArticleResourcesAside.module.scss";

interface ArticleResourcesAsideProps {
    resources: ResourceItem[];
}

export function ArticleResourcesAside({ resources }: ArticleResourcesAsideProps) {
    if (!resources.length) return null;

    return (
        <aside className={styles.aside}>
            <Card className={styles.card}>
                <CardHeader className={styles.header}>
                    <div className={styles.titleRow}>
                        <div className={styles.iconWrap}>
                            <FolderOpen size={16} />
                        </div>
                        <h2>Resources</h2>
                    </div>
                </CardHeader>

                <CardContent className={styles.body}>
                    <div className={styles.list}>
                        {resources.map((resource) => (
                            <a
                                key={resource.id}
                                href={resource.href}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.item}
                            >
                                <div className={styles.itemText}>
                                    <strong>{resource.title}</strong>
                                    <span>{resource.provider}</span>
                                </div>
                                <ExternalLink size={14} />
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}