import { useEffect, useState } from "react";
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

const SIDEBAR_STORAGE_KEY = "corkairportdojo.sidebar.collapsed";

export function AppShell({
                             children,
                             hideDefaultRightSidebar = false,
                             weatherAlert = null,
                             closureNotice = null,
                         }: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [hasLoadedSidebarPreference, setHasLoadedSidebarPreference] = useState(false);

    useEffect(() => {
        const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

        if (storedValue === "true") {
            setSidebarCollapsed(true);
        } else if (storedValue === "false") {
            setSidebarCollapsed(false);
        }

        setHasLoadedSidebarPreference(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedSidebarPreference) return;

        window.localStorage.setItem(
            SIDEBAR_STORAGE_KEY,
            String(sidebarCollapsed)
        );
    }, [hasLoadedSidebarPreference, sidebarCollapsed]);

    const toggleSidebarCollapsed = () => {
        setSidebarCollapsed((value) => !value);
    };

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
                        onToggleCollapse={toggleSidebarCollapsed}
                    />
                </div>

                <div className={styles.mainColumn}>
                    <div className={styles.headerShell}>
                        <Header
                            sidebarCollapsed={sidebarCollapsed}
                            onToggleSidebarCollapse={toggleSidebarCollapsed}
                        />
                    </div>

                    <div
                        className={`${styles.mainInner} ${
                            hideDefaultRightSidebar ? styles.mainInnerExpanded : ""
                        }`}
                    >
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