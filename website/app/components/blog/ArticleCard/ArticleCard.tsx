import { Clock3, FolderOpen } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
    resourceCount?: number;
}

export function ArticleCard({
                                id,
                                title,
                                excerpt,
                                category,
                                image,
                                author,
                                date,
                                readTime,
                                resourceCount = 0,
                            }: ArticleCardProps) {
    return (
        <Card className={styles.card}>
            <Link to={`/blog/${id}`} className={styles.cardLink}>
            <div className={styles.imageWrap}>
                <img
                    src={image}
                    alt={title}
                    className={styles.image}
                    onError={(event) => {
                        event.currentTarget.src = "/logo.png";
                    }}
                />
            </div>

            <CardContent className={styles.content}>
                <div className={styles.topRow}>
                    <Badge variant="outline" className={styles.categoryBadge}>
                        {category}
                    </Badge>

                    <div className={styles.resourceCount}>
                        <FolderOpen size={14} />
                        <span>{resourceCount}</span>
                    </div>
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.excerpt}>{excerpt}</p>

                <div className={styles.meta}>
                    <div className={styles.authorRow}>
                        <img src="/avatar.jpg" alt={author} className={styles.avatar} />
                        <div className={styles.authorMeta}>
                            <strong>{author}</strong>
                            <span>{date}</span>
                        </div>
                    </div>

                    <div className={styles.readTime}>
                        <Clock3 size={15} />
                        <span>{readTime}</span>
                    </div>
                </div>
            </CardContent>
            </Link>
        </Card>
    );
}