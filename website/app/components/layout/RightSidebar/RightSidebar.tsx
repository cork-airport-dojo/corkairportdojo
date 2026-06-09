import {
    ArrowRight,
    BookMarked,
    Megaphone,
    TriangleAlert,
    Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { RailCardHeader } from "~/components/common/RailCardHeader/RailCardHeader";
import styles from "./RightSidebar.module.scss";

const notices = [
    "CorkAirportClub will close for the summer period.",
    "We plan to reopen again in September.",
    "Please sign up early for the new modules on the website.",
];

const recentlyRead = [
    {
        title: "Understanding Next.js 14 App Router",
        category: "Next.js",
        readAt: "Today",
    },
    {
        title: "TypeScript Tips for Better Development",
        category: "TypeScript",
        readAt: "Yesterday",
    },
    {
        title: "Database Design Principles",
        category: "Database",
        readAt: "2 days ago",
    },
    {
        title: "Why React Architecture Matters",
        category: "React",
        readAt: "Last week",
    },
];

const popularModules = [
    { title: "React Fundamentals", lessons: "12 Lessons" },
    { title: "TypeScript Essentials", lessons: "15 Lessons" },
    { title: "Authentication & Security", lessons: "11 Lessons" },
];

export function RightSidebar() {
    return (
        <div className={styles.rail}>
            <Card className={`${styles.sidebarCard} ${styles.weatherCard}`}>
                <CardHeader className={styles.cardHeader}>
                    <RailCardHeader
                        title="Weather Alert"
                        icon={<TriangleAlert size={18} className={styles.weatherAlertIcon} />}
                        className={styles.weatherHeader}
                    />
                </CardHeader>

                <CardContent className={styles.cardBody}>
                    <div className={styles.weatherContent}>
                        <div className={styles.weatherBodyTop}>
                            <div className={styles.weatherBodyIcon}>
                                <Wind size={54} strokeWidth={1.8} />
                            </div>

                            <div className={styles.weatherText}>
                                <h4>Yellow Wind Warning</h4>
                                <p className={styles.weatherLocation}>Cork, Ireland</p>
                                <span className={styles.weatherTime}>
                  18:00 Today - 03:00 Tomorrow
                </span>
                            </div>
                        </div>

                        <p className={styles.weatherSummary}>Strong winds expected.</p>

                        <a href="#" className={styles.weatherLink}>
                            View Details <ArrowRight size={15} />
                        </a>
                    </div>
                </CardContent>
            </Card>

            <Card className={styles.sidebarCard}>
                <CardHeader className={styles.cardHeader}>
                    <RailCardHeader
                        title="Important Notices"
                        icon={<Megaphone size={18} />}
                    />
                </CardHeader>

                <CardContent className={styles.cardBody}>
                    <div className={styles.noticeList}>
                        {notices.map((notice) => (
                            <div key={notice} className={styles.noticeItem}>
                                <span className={styles.noticeDot} />
                                <p>{notice}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className={styles.sidebarCard}>
                <CardHeader className={styles.cardHeader}>
                    <RailCardHeader
                        title="Recently Read"
                        icon={<BookMarked size={18} />}
                    />
                </CardHeader>

                <CardContent className={styles.cardBody}>
                    <div className={styles.recentList}>
                        {recentlyRead.map((article) => (
                            <button
                                key={article.title}
                                className={styles.recentItem}
                                type="button"
                            >
                                <strong>{article.title}</strong>
                                <div className={styles.recentMeta}>
                                    <span>{article.category}</span>
                                    <span>{article.readAt}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className={styles.sidebarCard}>
                <CardHeader className={styles.cardHeader}>
                    <RailCardHeader
                        title="Popular Modules"
                        action={<span className={styles.viewAll}>View all</span>}
                    />
                </CardHeader>

                <CardContent className={styles.cardBody}>
                    <div className={styles.moduleList}>
                        {popularModules.map((module) => (
                            <div key={module.title} className={styles.moduleItem}>
                                <div className={styles.moduleIcon} />
                                <div className={styles.moduleContent}>
                                    <strong>{module.title}</strong>
                                    <span>{module.lessons}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}