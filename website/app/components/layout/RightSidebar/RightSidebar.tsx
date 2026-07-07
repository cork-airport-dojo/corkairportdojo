import { useEffect, useMemo } from "react";
import {
    AlertTriangle,
    ArrowRight,
    BookMarked,
    Info,
    Megaphone,
    TriangleAlert,
    Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { RailCardHeader } from "~/components/common/RailCardHeader/RailCardHeader";
import type { CorkWeatherAlert } from "~/lib/constants/weather-warnings";
import {
    formatWeatherDateTime,
    getWeatherAlertAccent,
} from "~/lib/constants/weather-warnings";
import { useNoticesStore, type ImportantNotice } from "~/store/use-notices-store";
import { useModuleViewsStore } from "~/store/use-module-views-store";
import { useCustomModulesStore } from "~/store/use-custom-modules-store";
import { getAllModules } from "~/lib/get-all-modules";
import styles from "./RightSidebar.module.scss";

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

interface RightSidebarProps {
    weatherAlert?: CorkWeatherAlert | null;
}

function getNoticeAccent(notice: ImportantNotice) {
    if (notice.severity === "closure") {
        return {
            dot: "#ef4444",
            text: "#fca5a5",
            background: "rgba(239, 68, 68, 0.08)",
            border: "rgba(239, 68, 68, 0.3)",
            icon: AlertTriangle,
        };
    }

    if (notice.severity === "warning") {
        return {
            dot: "#f59e0b",
            text: "#fcd34d",
            background: "rgba(245, 158, 11, 0.08)",
            border: "rgba(245, 158, 11, 0.3)",
            icon: TriangleAlert,
        };
    }

    return {
        dot: "#3b82f6",
        text: "#93c5fd",
        background: "rgba(59, 130, 246, 0.08)",
        border: "rgba(59, 130, 246, 0.3)",
        icon: Info,
    };
}

export function RightSidebar({ weatherAlert }: RightSidebarProps) {
    const { notices, hydrate, clearInactiveNotices, getVisibleNotices } = useNoticesStore();
    const { views, hydrate: hydrateModuleViews, getViews } = useModuleViewsStore();
    const { modules: customModules, hydrate: hydrateCustomModules } = useCustomModulesStore();

    useEffect(() => {
        hydrate();
        clearInactiveNotices();
    }, [hydrate, clearInactiveNotices]);

    useEffect(() => {
        hydrateModuleViews();
        hydrateCustomModules();
    }, [hydrateModuleViews, hydrateCustomModules]);

    const visibleNotices = useMemo(() => getVisibleNotices(), [notices, getVisibleNotices]);

    const popularModules = useMemo(() => {
        return getAllModules(customModules)
            .map((module) => ({
                ...module,
                totalViews: getViews(module.id, module.views),
            }))
            .sort((a, b) => b.totalViews - a.totalViews)
            .slice(0, 3);
    }, [customModules, views, getViews]);

    const showWeatherCard = weatherAlert?.hasAlert;
    const alertAccent = getWeatherAlertAccent(weatherAlert?.level ?? null);

    const timeLabel =
        weatherAlert?.onset && weatherAlert?.expiry
            ? `${formatWeatherDateTime(weatherAlert.onset)} - ${formatWeatherDateTime(
                weatherAlert.expiry
            )}`
            : null;

    return (
        <div className={styles.rail}>
            {showWeatherCard && weatherAlert && (
                <Card
                    className={`${styles.sidebarCard} ${styles.weatherCard}`}
                    style={{
                        borderColor: alertAccent.border,
                    }}
                >
                    <CardHeader className={styles.cardHeader}>
                        <RailCardHeader
                            title={
                                weatherAlert.level
                                    ? `${weatherAlert.level.toUpperCase()} Weather Alert`
                                    : "Weather Alert"
                            }
                            icon={
                                <TriangleAlert
                                    size={18}
                                    className={styles.weatherAlertIcon}
                                    style={{ color: alertAccent.text }}
                                />
                            }
                            className={styles.weatherHeader}
                        />
                    </CardHeader>

                    <CardContent className={styles.cardBody}>
                        <div className={styles.weatherContent}>
                            <div className={styles.weatherBodyTop}>
                                <div
                                    className={styles.weatherBodyIcon}
                                    style={{ color: alertAccent.text }}
                                >
                                    <Wind size={44} strokeWidth={1.8} />
                                </div>

                                <div className={styles.weatherText}>
                                    <h4 style={{ color: alertAccent.title }}>
                                        {weatherAlert.headline}
                                    </h4>
                                    <p className={styles.weatherLocation}>Cork, Ireland</p>
                                    {timeLabel && (
                                        <span className={styles.weatherTime}>{timeLabel}</span>
                                    )}
                                </div>
                            </div>

                            <p className={styles.weatherSummary}>
                                {weatherAlert.description}
                            </p>

                            <a
                                href={weatherAlert.sourceUrl}
                                className={styles.weatherLink}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Details <ArrowRight size={15} />
                            </a>
                        </div>
                    </CardContent>
                </Card>
            )}

            {visibleNotices.length > 0 && (
                <Card className={styles.sidebarCard}>
                    <CardHeader className={styles.cardHeader}>
                        <RailCardHeader
                            title="Important Notices"
                            icon={<Megaphone size={18} />}
                        />
                    </CardHeader>

                    <CardContent className={styles.cardBody}>
                        <div className={styles.noticeList}>
                            {visibleNotices.map((notice) => {
                                const accent = getNoticeAccent(notice);
                                const NoticeIcon = accent.icon;

                                return (
                                    <div
                                        key={notice.id}
                                        className={styles.noticePanel}
                                        style={{
                                            borderColor: accent.border,
                                            background: accent.background,
                                        }}
                                    >
                                        <div className={styles.noticeSeverityIcon} style={{ color: accent.text }}>
                                            <NoticeIcon size={15} />
                                        </div>

                                        <div className={styles.noticeBody}>
                                            <div className={styles.noticeBadges}>
                                                <span className={styles.noticeSeverityLabel}>
                                                    {notice.severity}
                                                </span>
                                                {notice.pinned && (
                                                    <span className={styles.noticePinnedLabel}>Pinned</span>
                                                )}
                                            </div>

                                            <p>{notice.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

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
                            <div key={module.id} className={styles.moduleItem}>
                                <div className={styles.moduleIcon} />
                                <div className={styles.moduleContent}>
                                    <strong>{module.title}</strong>
                                    <span>{module.totalViews} views</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}