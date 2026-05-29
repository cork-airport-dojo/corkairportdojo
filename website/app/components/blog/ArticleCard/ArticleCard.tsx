import { Clock3 } from "lucide-react";
import { Badge } from "../../common/Badge/Badge";
import { profile } from "~/lib/constants/profile";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
    title: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    authorImage?: string;
}

export function ArticleCard({
                                title,
                                category,
                                excerpt,
                                author,
                                date,
                                readTime,
                                image,
                                authorImage = profile.avatar,
                            }: ArticleCardProps) {
    return (
        <article className={styles.card}>
            <div
                className={styles.cover}
                style={{ backgroundImage: `url(${image})` }}
            />

            <div className={styles.content}>
                <Badge variant="topic">{category}</Badge>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.excerpt}>{excerpt}</p>

                <div className={styles.meta}>
                    <div className={styles.author}>
                        <img src={authorImage} alt={author} />
                        <div className={styles.authorInfo}>
                            <span className={styles.authorName}>{author}</span>
                            <span className={styles.date}>{date}</span>
                        </div>
                    </div>

                    <span className={styles.readTime}>
            <Clock3 size={14} />
                        {readTime}
          </span>
                </div>
            </div>
        </article>
    );
}