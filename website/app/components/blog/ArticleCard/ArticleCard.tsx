import { Clock3 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
    title: string;
    excerpt: string;
    category: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
}

export function ArticleCard({
                                title,
                                excerpt,
                                category,
                                image,
                                author,
                                date,
                                readTime,
                            }: ArticleCardProps) {
    return (
        <Card className={styles.card}>
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
                <Badge variant="outline" className={styles.categoryBadge}>
                    {category}
                </Badge>

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
        </Card>
    );
}