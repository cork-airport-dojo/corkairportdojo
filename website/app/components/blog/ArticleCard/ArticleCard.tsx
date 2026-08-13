import { Clock3} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import styles from "./ArticleCard.module.scss";
import { Skeleton } from "~/components/ui/skeleton";
import Truncated from "~/components/common/Truncated/Truncated";

interface ArticleCardProps {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    author: string;
    authorAvatarUrl?: string | null;
    date: string;
    readTime: string;
    resourceCount?: number;
}

export function ArticleCardSkeleton() {
    return (
        <Card>
            <div className={styles.imageWrap}>
                <Skeleton className="aspect-video w-full" />
            </div>
            <CardContent className={styles.content}>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-2 w-24" />

                <div className="mt-4">
                    <div className={styles.authorRow}>
                        <Skeleton className="w-[32px] h-[32px] rounded-full mb-4" />
                        <div className={styles.authorMeta}>
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-2 w-24" />
                        </div>
                    </div>

                    <div className={styles.readTime}>
                        <Clock3 size={15} />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>

            </CardContent>
        </Card>

    )

}

export function ArticleCard({
    id,
    title,
    excerpt,
    image,
    author,
    authorAvatarUrl,
    date,
    readTime,
}: ArticleCardProps) {
    return (
        <Card className={styles.card}>
            <Link to={`/blog/${id}`} className={styles.cardLink}>
                <div className={styles.imageWrap}>
                    <img
                        src={image ? image : '/logo.webp'}
                        alt={title}
                        className={styles.image}
                        onError={(event) => {
                            event.currentTarget.src = "/logo.webp";
                        }}
                    />
                </div>

                <CardContent className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.excerpt}>
                        <Truncated length={200}>
                        {excerpt || "No description provided yet."}
                        </Truncated>
                    </p>

                    <div className={styles.meta}>
                        <div className={styles.authorRow}>
                            <img
                                src={authorAvatarUrl || "/logo.webp"}
                                alt={author}
                                className={styles.avatar}
                                onError={(event) => {
                                    event.currentTarget.src = "/logo.webp";
                                }}
                            />
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