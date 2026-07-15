import { ExternalLink, FolderOpen } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import styles from "./ArticleResourcesAside.module.scss";

interface ArticleResourceItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
}

interface ArticleResourcesAsideProps {
    resources: ArticleResourceItem[];
}

export function ArticleResourcesAside({
                                          resources,
                                      }: ArticleResourcesAsideProps) {
    if (!resources.length) {
        return (
            <Card className={styles.card}>
                <CardHeader className={styles.header}>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>
                        No linked resources have been added to this article yet.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <CardTitle>Resources for this article</CardTitle>
                <CardDescription>
                    Continue learning with the linked references below.
                </CardDescription>
            </CardHeader>

            <CardContent className={styles.body}>
                <div className={styles.list}>
                    {resources.map((resource) => (
                        <a
                            key={resource.id}
                            href={resource.href}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.resourceLink}
                        >
                            <div className={styles.resourceImageWrap}>
                                <img
                                    src={resource.image || "/logo.png"}
                                    alt={resource.title}
                                    className={styles.resourceImage}
                                    onError={(event) => {
                                        event.currentTarget.src = "/logo.png";
                                    }}
                                />
                            </div>

                            <div className={styles.resourceContent}>
                                <div className={styles.resourceTop}>
                                    <Badge variant="outline">{resource.provider}</Badge>
                                    <span className={styles.category}>{resource.category}</span>
                                </div>

                                <strong className={styles.resourceTitle}>
                                    {resource.title}
                                </strong>

                                <p className={styles.resourceDescription}>
                                    {resource.description}
                                </p>

                                <span className={styles.resourceAction}>
                                    Open Resource <ExternalLink size={14} />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}