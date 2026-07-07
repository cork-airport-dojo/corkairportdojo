import { ExternalLink, FolderOpen } from "lucide-react";
import type {ResourceItem} from "~/lib/constants/resources";
import { Card, CardContent } from "~/components/ui/card";
import styles from "./ResourceCard.module.scss";

interface ResourceCardProps {
    resource: ResourceItem;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    return (
        <Card className={styles.card}>
            <div className={styles.imageWrap}>
                <img
                    src={resource.image}
                    alt={resource.title}
                    className={styles.image}
                    onError={(event) => {
                        event.currentTarget.src = "/logo.png";
                    }}
                />
            </div>

            <CardContent className={styles.content}>
                <div className={styles.categoryRow}>
                    <span className={styles.category}>{resource.category}</span>
                    <span className={styles.provider}>{resource.provider}</span>
                </div>

                <h3 className={styles.title}>{resource.title}</h3>
                <p className={styles.description}>{resource.description}</p>

                <div className={styles.tagRow}>
                    {resource.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                >
                    <FolderOpen size={16} />
                    <span>Open Resource</span>
                    <ExternalLink size={14} />
                </a>
            </CardContent>
        </Card>
    );
}