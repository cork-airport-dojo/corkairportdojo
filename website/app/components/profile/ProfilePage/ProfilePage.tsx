import { useEffect, useMemo } from "react";
import {
    Mail,
    ShieldCheck,
    UserCircle2,
} from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ArticleManager } from "~/components/admin/ArticleManager/ArticleManager";
import { NoticeManager } from "~/components/admin/NoticeManager/NoticeManager";
import { ModuleManager } from "~/components/admin/ModuleManager/ModuleManager";
import { HeroCTAButtonManager } from "~/components/admin/HeroCTAButtonManager/HeroCTAButtonManager";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./ProfilePage.module.scss";

function formatJoinedDate(value?: string) {
    if (!value) return "Joined recently";

    try {
        return `Joined ${new Intl.DateTimeFormat("en-IE", {
            month: "long",
            year: "numeric",
        }).format(new Date(value))}`;
    } catch {
        return "Joined recently";
    }
}

export function ProfilePage() {
    const { hydrate, isAdmin, user, userName, avatarUrl } = useAuthStore();
    const { isAuthenticated, role, canManageContent } = useAuthStore();
    const canManageSiteSettings = isAuthenticated && role === "admin";

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    const metadata = user?.user_metadata ?? {};

    const githubUsername =
        metadata.user_name ||
        metadata.preferred_username ||
        metadata.username ||
        "GitHub user";

    const fullName = userName || "GitHub user";
    const email = user?.email || "No public email";
    const joined = formatJoinedDate(user?.created_at);
    const bio =
        metadata.bio ||
        "Signed in with GitHub. Your account information is now linked to CorkAirportDojo.";

    const stats = useMemo(
        () => [
            { label: "Authentication", value: "GitHub" },
            { label: "Account Status", value: user ? "Active" : "Signed out" },
            { label: "Role", value: isAdmin ? "Admin" : "Member" },
            { label: "Profile Source", value: "Supabase Auth" },
        ],
        [isAdmin, user]
    );

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarFallback}>
                            {fullName.slice(0, 1).toUpperCase() || "U"}
                        </div>
                    )}

                    <div className={styles.heroContent}>
                        <div className={styles.eyebrow}>Profile</div>
                        <h1 className={styles.name}>{fullName}</h1>
                        <p className={styles.role}>@{githubUsername}</p>
                        <p className={styles.bio}>{bio}</p>

                        <div className={styles.metaRow}>
                            <span>
                                <Mail size={14} />
                                {email}
                            </span>
                            <span>{joined}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.heroActions}>
                    <div className={styles.providerBadge}>
                        <FiGithub size={16} />
                        <span>GitHub Connected</span>
                    </div>
                </div>
            </section>

            {canManageContent && <ArticleManager />}
            {canManageContent && <NoticeManager />}
            {canManageSiteSettings && <ModuleManager />}
            {canManageSiteSettings && <HeroCTAButtonManager />}

            <section className={styles.statsGrid}>
                {stats.map((stat) => (
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
                                    <UserCircle2 size={16} />
                                </div>
                                <h2>GitHub Account</h2>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            <div className={styles.list}>
                                <div className={styles.listItem}>
                                    <div className={styles.listItemText}>
                                        <strong>Display Name</strong>
                                        <span>{fullName}</span>
                                    </div>
                                </div>

                                <div className={styles.listItem}>
                                    <div className={styles.listItemText}>
                                        <strong>GitHub Username</strong>
                                        <span>@{githubUsername}</span>
                                    </div>
                                </div>

                                <div className={styles.listItem}>
                                    <div className={styles.listItemText}>
                                        <strong>Email</strong>
                                        <span>{email}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <aside className={styles.rail}>
                    <Card className={styles.panel}>
                        <CardHeader className={styles.panelHeader}>
                            <div className={styles.panelTitleRow}>
                                <div className={styles.panelIcon}>
                                    <ShieldCheck size={16} />
                                </div>
                                <h2>Session</h2>
                            </div>
                        </CardHeader>
                        <CardContent className={styles.panelBody}>
                            <div className={styles.badgeList}>
                                <span className={styles.badge}>Authenticated</span>
                                <span className={styles.badge}>GitHub OAuth</span>
                                {isAdmin && <span className={styles.badge}>Admin</span>}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}