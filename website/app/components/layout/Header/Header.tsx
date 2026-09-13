import { MobileSidebar } from "../MobileSidebar/MobileSidebar";
import styles from "./Header.module.scss";
import LoginDropdown from "~/components/LoginDropdown/LoginDropdown";
import { Spotlight } from "~/components/spotlight/Spotlight";

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
          <Spotlight />
        </div>
      </div>

      <div className={styles.actions}>
        <LoginDropdown />
      </div>
    </header>
  );
}
