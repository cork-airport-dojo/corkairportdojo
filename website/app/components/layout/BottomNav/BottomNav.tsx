import { NavLink } from "react-router";
import { mobileNavItems } from "~/lib/constants/nav";
import styles from "./BottomNav.module.scss";

export function BottomNav() {
    return (
        <nav className={styles.bottomNav}>
            {mobileNavItems.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            [styles.item, isActive ? styles.itemActive : ""]
                                .filter(Boolean)
                                .join(" ")
                        }
                    >
                        <Icon size={19} />
                        <span>{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
}