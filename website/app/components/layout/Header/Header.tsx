import { Bell, ChevronDown, Moon, Search } from "lucide-react";
import styles from "./Header.module.scss";

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.searchWrap}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    placeholder="Search articles, modules, topics..."
                    aria-label="Search"
                />
                <span className={styles.shortcut}>⌘K</span>
            </div>

            <div className={styles.actions}>
                <button className={styles.iconButton} aria-label="Toggle theme">
                    <Moon size={18} />
                </button>

                <button className={styles.iconButton} aria-label="Notifications">
                    <Bell size={18} />
                    <span className={styles.notificationDot}>3</span>
                </button>

                <button className={styles.profileButton} aria-label="User menu">
                    <img src="/logo-mark.png" alt="Profile" />
                    <span className={styles.profileName}>Chris Murphy</span>
                    <ChevronDown size={16} className={styles.profileChevron} />
                </button>
            </div>
        </header>
    );
}