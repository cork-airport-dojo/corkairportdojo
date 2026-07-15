import { useEffect } from "react";
import {
    BookOpen,
    ChevronDown,
    ChevronLeft,
    Home,
    Info,
    Layers3,
    PenSquare,
    User,
    LogOut,
    FolderOpen,
    CalendarPlus,
    FolderPlus,
    Mail,
} from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { NavLink, Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { GitHubLoginButton } from "~/components/auth/GitHubLoginButton/GitHubLoginButton";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./Sidebar.module.scss";

const publicNavItems = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/modules", label: "Modules", icon: Layers3 },
    { to: "/blog", label: "Articles", icon: BookOpen },
    { to: "/resources", label: "Resources", icon: FolderOpen },
    { to: "/about", label: "About", icon: Info },
];

const privateNavItems = [{ to: "/profile", label: "Profile", icon: User }];

const contentQuickActions = [
    { to: "/write", label: "Create Article", icon: PenSquare },
    { to: "/modules/new", label: "Create Module", icon: Layers3 },
    { to: "/resources", label: "Add Resource", icon: FolderPlus },
    { to: "/profile", label: "Create Event", icon: CalendarPlus },
];

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        userName,
        avatarUrl,
        canManageContent,
        hydrate,
        signOut,
    } = useAuthStore();

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    const navItems = isAuthenticated
        ? [...publicNavItems, ...privateNavItems]
        : publicNavItems;

    const handleLogout = async () => {
        await signOut();
        navigate("/", { replace: true });
    };

    return (
        <aside
            className={`${styles.sidebar} ${
                collapsed ? styles.sidebarCollapsed : ""
            }`}
        >
            <div className={styles.logoArea}>
                <div className={styles.brand}>
                    <img src="/logo-mark.svg" alt="CorkAirportDojo" />
                    {!collapsed && (
                        <div>
                            <span className={styles.brandTitle}>CorkAirportDojo</span>
                            <span className={styles.brandSubtitle}>Learn. Build. Grow.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.mainSections}>
                <nav className={styles.navSection}>
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                                }
                                title={collapsed ? item.label : undefined}
                            >
                                <span className={styles.navItemAccent} />
                                <Icon size={20} />
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {canManageContent && (
                    <section className={styles.quickActionsSection}>
                        {!collapsed && <span className={styles.sectionLabel}>Quick Actions</span>}

                        <div className={styles.quickActionsList}>
                            {contentQuickActions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className={styles.quickActionItem}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon size={18} />
                                        {!collapsed && <span>{item.label}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section className={styles.connectSection}>
                    {!collapsed && <span className={styles.sectionLabel}>Connect</span>}

                    <div className={styles.connectRow}>
                        <a
                            href="https://github.com/SentinelMurphy"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.connectButton}
                            aria-label="GitHub"
                            title="GitHub"
                        >
                            <FiGithub size={20} />
                        </a>

                        <a
                            href="https://www.linkedin.com/"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.connectButton}
                            aria-label="LinkedIn"
                            title="LinkedIn"
                        >
                            <FiLinkedin size={20} />
                        </a>

                        <a
                            href="mailto:hello@corkairportdojo.com"
                            className={styles.connectButton}
                            aria-label="Email"
                            title="Email"
                        >
                            <Mail size={20} />
                        </a>
                    </div>
                </section>
            </div>

            <div className={styles.bottomSections}>
                {isAuthenticated ? (
                    !collapsed ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={styles.profileCard}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={userName} />
                                    ) : (
                                        <div className={styles.avatarFallback}>
                                            {userName.slice(0, 1).toUpperCase() || "U"}
                                        </div>
                                    )}

                                    <div className={styles.profileInfo}>
                                        <strong>{userName}</strong>
                                        <span>Signed in</span>
                                        <em>View Profile</em>
                                    </div>

                                    <ChevronDown size={16} className={styles.profileChevron} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                side="top"
                                className={styles.sidebarProfileMenu}
                            >
                                <DropdownMenuItem asChild>
                                    <Link to="/profile">
                                        <User size={16} />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                {/*<DropdownMenuItem>
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </DropdownMenuItem>*/}
                                <DropdownMenuItem onClick={() => void handleLogout()}>
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            to="/profile"
                            className={styles.collapsedProfileButton}
                            aria-label="Profile"
                            title={userName || "Profile"}
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={userName} />
                            ) : (
                                <div className={styles.avatarFallback}>
                                    {userName.slice(0, 1).toUpperCase() || "U"}
                                </div>
                            )}
                        </Link>
                    )
                ) : (
                    <GitHubLoginButton
                        redirectTo="/profile"
                        className={`${styles.loginCta} ${collapsed ? styles.loginCtaCollapsed : ""}`}
                        label="Sign in with GitHub"
                        iconOnly={collapsed}
                        title="Sign in with GitHub"
                    />
                )}

                <div className={styles.settingsSection}>
                    {/*{!collapsed ? (
                        <Button type="button" variant="outline" className={styles.settingsButton}>
                            <Settings size={18} />
                            <span>Settings</span>
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className={styles.settingsIconButton}
                            aria-label="Settings"
                            title="Settings"
                        >
                            <Settings size={18} />
                        </Button>
                    )}*/}

                    <Button
                        type="button"
                        variant="outline"
                        className={styles.collapseButton}
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={collapsed ? "Expand sidebar" : undefined}
                    >
                        <ChevronLeft
                            size={16}
                            className={collapsed ? styles.chevronCollapsed : ""}
                        />
                        {!collapsed && <span>Collapse Sidebar</span>}
                    </Button>
                </div>
            </div>
        </aside>
    );
}