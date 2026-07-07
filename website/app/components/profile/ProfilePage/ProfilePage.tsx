import { useEffect } from "react";
import { Award, Bookmark, Clock3, FileText, MapPin, PencilLine } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { NoticeManager } from "~/components/admin/NoticeManager/NoticeManager";
import { ModuleManager } from "~/components/admin/ModuleManager/ModuleManager";
import { HeroCTAButtonManager } from "~/components/admin/HeroCTAButtonManager/HeroCTAButtonManager";
import { profile } from "~/lib/constants/profile";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./ProfilePage.module.scss";

export function ProfilePage() {
    const { hydrate, isAdmin } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <img
                        src={profile.avatar}
                        alt={profile.name}
                        className={styles.avatar}
                    />

                    <div className={styles.heroContent}>
                        <div className={styles.eyebrow}>Profile</div>
                        <h1 className={styles.name}>{profile.name}</h1>
                        <p className={styles.role}>{profile.role}</p>
                        <p className={styles.bio}>{profile.bio}</p>

                        <div className={styles.metaRow}>
                            <span>
                                <MapPin size={14} />
                                {profile.location}
                            </span>
                            <span>
                                <Clock3 size={14} />
                                {profile.timezone}
                            </span>
                            <span>{profile.joined}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.heroActions}>
                    <Button className={styles.primaryAction}>
                        <PencilLine size={16} />
                        Edit Profile
                    </Button>
                    <Button variant="outline" className={styles.secondaryAction}>
                        View Public Profile
                    </Button>
                </div>
            </section>

            {isAdmin && <NoticeManager />}
            {isAdmin && <ModuleManager />}
            {isAdmin && <HeroCTAButtonManager/>}


            <section className={styles.statsGrid}>
                {profile.stats.map((stat) => (
                    <Card key={stat.label} className={styles.statCard}>
                        <CardContent className={styles.statCardContent}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <strong className={styles.statValue}>{stat.value}</strong>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <div className={styles.contentLayout}>
                <div className={styles.mainColumn}>
                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitleRow}>
                                <div className={styles.panelIcon}>
                                    <FileText size={16} />
                                </div>
                                <h2>Recent Articles</h2>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            <div className={styles.list}>
                                {profile.recentArticles.map((item) => (
                                    <div key={item.title} className={styles.listItem}>
                                        <div className={styles.listItemText}>
                                            <strong>{item.title}</strong>
                                            <span>{item.category}</span>
                                        </div>
                                        <span className={styles.listMeta}>{item.meta}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitleRow}>
                                <div className={styles.panelIcon}>
                                    <Bookmark size={16} />
                                </div>
                                <h2>Saved Content</h2>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            <div className={styles.list}>
                                {profile.savedItems.map((item) => (
                                    <div key={item.title} className={styles.listItem}>
                                        <div className={styles.listItemText}>
                                            <strong>{item.title}</strong>
                                            <span>{item.type}</span>
                                        </div>
                                        <span className={styles.listMeta}>{item.meta}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitleRow}>
                                <div className={styles.panelIcon}>
                                    <Clock3 size={16} />
                                </div>
                                <h2>Recent Activity</h2>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            <div className={styles.activityList}>
                                {profile.activity.map((item) => (
                                    <div key={item.title} className={styles.activityItem}>
                                        <span className={styles.activityDot} />
                                        <div className={styles.activityText}>
                                            <strong>{item.title}</strong>
                                            <span>{item.meta}</span>
                                        </div>
                                    </div>
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
                                    <Award size={16} />
                                </div>
                                <h2>Achievements</h2>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            <div className={styles.badgeList}>
                                {profile.achievements.map((item) => (
                                    <span key={item} className={styles.badge}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}