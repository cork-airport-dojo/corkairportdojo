import { BookOpen, FolderKanban, Hash, Home, Info, Layers3, PenSquare, Bookmark } from "lucide-react";
import { NavLink } from "react-router";
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

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <img src="/logo-mark.png" alt="CorkAirportDojo" />
                <div>
                    <span className={styles.brandTitle}>CorkAirportDojo</span>
                    <span className={styles.brandSubtitle}>Learn. Build. Grow.</span>
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
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <button className={styles.writeCta} type="button">
                <PenSquare size={18} />
                <span>Write Post</span>
            </button>
        </aside>
    );
}