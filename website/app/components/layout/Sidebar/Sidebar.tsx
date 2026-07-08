import { useEffect } from "react";
import {
    BookOpen,
    ChevronDown,
    ChevronLeft,
    FolderKanban,
    Hash,
    Home,
    Info,
    Layers3,
    Bookmark,
    PenSquare,
    User,
    Settings,
    LogOut,
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
    { to: "/categories", label: "Categories", icon: FolderKanban },
    { to: "/tags", label: "Tags", icon: Hash },
    { to: "/resources", label: "Resources", icon: Bookmark },
    { to: "/about", label: "About", icon: Info },
];

const privateNavItems = [{ to: "/profile", label: "Profile", icon: User }];

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
            <div className={styles.top}>
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

            <nav className={styles.nav}>
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
                            <Icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                {isAuthenticated ? (
                    <Button asChild className={styles.writeCta} size="lg">
                        <Link to="/write">
                            <PenSquare size={18} />
                            {!collapsed && <span>Write Post</span>}
                        </Link>
                    </Button>
                ) : (
                    <GitHubLoginButton
                        redirectTo="/write"
                        className={`${styles.loginCta} ${collapsed ? styles.loginCtaCollapsed : ""}`}
                        label="Sign in with GitHub"
                        iconOnly={collapsed}
                        title="Sign in with GitHub"
                    />
                )}

                {!collapsed && isAuthenticated && (
                    <>
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
                                        <span>View Profile</span>
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
                                <DropdownMenuItem>
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => void handleLogout()}>
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className={styles.socialRow}>
                            <Button asChild variant="outline" size="icon" className={styles.socialButton}>
                                <a
                                    href="https://github.com/SentinelMurphy"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                >
                                    <FiGithub size={16} />
                                </a>
                            </Button>

                            <Button asChild variant="outline" size="icon" className={styles.socialButton}>
                                <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <FiLinkedin size={16} />
                                </a>
                            </Button>
                        </div>
                    </>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className={styles.collapseButton}
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <ChevronLeft
                        size={18}
                        className={collapsed ? styles.chevronCollapsed : ""}
                    />
                    {!collapsed && <span>Collapse</span>}
                </Button>
            </div>
        </aside>
    );
}