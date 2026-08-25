import { useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { MobileSidebar } from "../MobileSidebar/MobileSidebar";
import styles from "./Header.module.scss";
import LoginDropdown from "~/components/LoginDropdown/LoginDropdown";

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
        <div className={styles.mobileTriggerWrap}>
          <MobileSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={onToggleSidebarCollapse}
          />
        </div>

        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <Input
            disabled
            className={styles.searchInput}
            placeholder="Search coming soon"
            aria-label="Search articles, modules, topics"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <LoginDropdown />
      </div>
    </header>
  );
}
