import { useEffect } from "react";
import {
    BookOpen,
    Home,
    Info,
    Layers3,
    PenSquare,
    User,
    FolderOpen,
    CalendarPlus,
    FolderPlus,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router";
import { useAuthStore } from "~/store/use-auth-store";
import styles from "./Sidebar.module.scss";
import LoginDropdown from "~/components/LoginDropdown/LoginDropdown";

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
    { to: "/profile#events", label: "Create Event", icon: CalendarPlus },
];

interface SidebarProps {
    collapsed: boolean;
    // onToggleCollapse: () => void;
}

export function Sidebar({ collapsed }: SidebarProps) {
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
        <Link to="/" className={styles.logoArea}>
          <div className={styles.brand}>
            <img src="/logo-mark.svg" alt="CorkAirportDojo" />
            {!collapsed && (
              <div>
                <span className={styles.brandTitle}>CorkAirportDojo</span>
                <span className={styles.brandSubtitle}>
                  Learn. Build. Grow.
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className={styles.mainSections}>
          <nav className={styles.navSection}>
            <section>
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
            </section>

            {canManageContent && (
              <section className={styles.quickActionsSection}>
                {!collapsed && (
                  <span className={styles.sectionLabel}>Quick Actions</span>
                )}

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

            <div className={styles.mobileLogin}>
              <LoginDropdown />
            </div>
          </nav>
        </div>
      </aside>
    );
}