import { useState } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { RightSidebar } from "../RightSidebar/RightSidebar";
import { DojoClosureBanner } from "~/components/weather/DojoClosureBanner/DojoClosureBanner";
import type { CorkWeatherAlert, DojoClosureNotice } from "~/lib/constants/weather-warnings";
import styles from "./AppShell.module.scss";

interface AppShellProps {
    children: React.ReactNode;
    hideDefaultRightSidebar?: boolean;
    weatherAlert?: CorkWeatherAlert | null;
    closureNotice?: DojoClosureNotice | null;
}

export function AppShell({
                             children,
                             hideDefaultRightSidebar = false,
                             weatherAlert = null,
                             closureNotice = null,
                         }: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.layout} ${
                    sidebarCollapsed ? styles.layoutCollapsed : ""
                }`}
            >
                <div
                    className={`${styles.sidebarColumn} ${
                        sidebarCollapsed ? styles.sidebarColumnCollapsed : ""
                    }`}
                >
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
                    />
                </div>

                <div className={styles.mainColumn}>
                    <Header
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebarCollapse={() =>
                            setSidebarCollapsed((value) => !value)
                        }
                    />

                    <div className={`${styles.mainInner} ${
                        hideDefaultRightSidebar ? styles.mainInnerExpanded : ""
                    }`}>

                        <main className={styles.content}>
                            <DojoClosureBanner notice={closureNotice} />
                            {children}
                        </main>

                        {!hideDefaultRightSidebar && (
                            <aside className={styles.aside}>
                                <RightSidebar weatherAlert={weatherAlert} />
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}