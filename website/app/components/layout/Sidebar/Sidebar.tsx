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
import { SiGithub } from "@icons-pack/react-simple-icons";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import styles from "./Sidebar.module.scss";

const navItems = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/modules", label: "Modules", icon: Layers3 },
    { to: "/blog", label: "Blog", icon: BookOpen },
    { to: "/categories", label: "Categories", icon: FolderKanban },
    { to: "/tags", label: "Tags", icon: Hash },
    { to: "/resources", label: "Resources", icon: Bookmark },
    { to: "/about", label: "About", icon: Info },
];

const profile = {
    name: "Chris Murphy",
    avatar: "/avatar.jpg",
};

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
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
                            <Icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <Button asChild className={styles.writeCta} size="lg">
                    <Link to="/write">
                        <PenSquare size={18} />
                        {!collapsed && <span>Write Post</span>}
                    </Link>
                </Button>

                {!collapsed && (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={styles.profileCard}>
                                    <img src={profile.avatar} alt={profile.name} />
                                    <div className={styles.profileInfo}>
                                        <strong>{profile.name}</strong>
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
                                <DropdownMenuItem>
                                    <User size={16} />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className={styles.socialRow}>
                            <Button
                                asChild
                                variant="outline"
                                size="icon"
                                className={`${styles.socialButton} ${styles.githubButton}`}
                            >
                                <a
                                    href="https://github.com/SentinelMurphy"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                >
                                    <SiGithub size={16} />
                                </a>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="icon"
                                className={`${styles.socialButton} ${styles.linkedinButton}`}
                            >
                                <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <SiGithub size={16} />
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