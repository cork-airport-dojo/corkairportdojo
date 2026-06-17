import {
    Bell,
    ChevronDown,
    LogOut,
    Moon,
    Search,
    Settings,
    User,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MobileSidebar } from "../MobileSidebar/MobileSidebar";
import styles from "./Header.module.scss";

interface HeaderProps {
    sidebarCollapsed: boolean;
    onToggleSidebarCollapse: () => void;
}

export function Header({
                           sidebarCollapsed,
                           onToggleSidebarCollapse,
                       }: HeaderProps) {
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={styles.profileButton}>
                            <img src="/avatar.jpg" alt="Chris Murphy" className={styles.avatar} />
                            <span className={styles.profileName}>Chris Murphy</span>
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className={styles.profileMenu}>
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
            </div>
        </header>
    );
}