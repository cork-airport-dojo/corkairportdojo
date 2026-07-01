import { useEffect } from "react";
import {
    Bell,
    ChevronDown,
    LogIn,
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
    const { isAuthenticated, userName, hydrate, logout } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const handleLogout = () => {
        logout();
        navigate("/login?redirectTo=%2Fwrite", { replace: true });
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftZone}>
                <MobileSidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={onToggleSidebarCollapse}
                />

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
                >
                    <Moon size={18} />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.iconButton}
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className={styles.badge}>2</span>
                </Button>

                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={styles.profileButton}>
                                <img src="/avatar.jpg" alt={userName} className={styles.avatar} />
                                <span className={styles.profileName}>{userName}</span>
                                <ChevronDown size={16} />
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
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button asChild variant="outline" className={styles.loginButton}>
                        <Link to="/login?redirectTo=%2Fwrite">
                            <LogIn size={16} />
                            <span>Login</span>
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    );
}
