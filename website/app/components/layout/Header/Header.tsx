import { useEffect } from "react";
import {
    Bell,
    ChevronDown,
    LogOut,
    Moon,
    Search,
    Settings,
    User,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { GitHubLoginButton } from "~/components/auth/GitHubLoginButton/GitHubLoginButton";
import { MobileSidebar } from "../MobileSidebar/MobileSidebar";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./Header.module.scss";

interface HeaderProps {
    sidebarCollapsed: boolean;
    onToggleSidebarCollapse: () => void;
}

export function Header({
                           sidebarCollapsed,
                           onToggleSidebarCollapse,
                       }: HeaderProps) {
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

    const handleLogout = async () => {
        await signOut();
        navigate("/", { replace: true });
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftZone}>
                <div className={styles.mobileTriggerWrap}>
                    <MobileSidebar
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={onToggleSidebarCollapse}
                    />
                </div>

                <div className={styles.searchWrap}>
                    <Search size={18} className={styles.searchIcon} />
                    <Input
                        className={styles.searchInput}
                        placeholder="Search articles, modules, topics..."
                        aria-label="Search articles, modules, topics"
                    />
                    <span className={styles.shortcut}>⌘K</span>
                </div>
            </div>

            <div className={styles.actions}>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.iconButton}
                    aria-label="Toggle theme"
                    title="Toggle theme"
                >
                    <Moon size={18} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.iconButton}
                    aria-label="Notifications"
                    title="Notifications"
                >
                    <Bell size={18} />
                    <span className={styles.badge}>2</span>
                </Button>

                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={styles.profileButton}>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={userName}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarFallback}>
                                        {userName.slice(0, 1).toUpperCase() || "U"}
                                    </div>
                                )}

                                <div className={styles.profileMeta}>
                                    <span className={styles.profileEyebrow}>Signed in</span>
                                    <span className={styles.profileName}>{userName}</span>
                                </div>

                                <ChevronDown size={16} className={styles.profileChevron} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className={styles.profileMenu}>
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
                ) : (
                    <GitHubLoginButton
                        redirectTo="/profile"
                        className={styles.loginButton}
                        label="Sign in with GitHub"
                    />
                )}
            </div>
        </header>
    );
}