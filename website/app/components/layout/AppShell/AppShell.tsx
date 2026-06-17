import { useState } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { RightSidebar } from "../RightSidebar/RightSidebar";
import styles from "./AppShell.module.scss";

interface AppShellProps {
    children: React.ReactNode;
    hideDefaultRightSidebar?: boolean;
}

export function AppShell({
                             children,
                             hideDefaultRightSidebar = false,
                         }: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className={styles.wrapper}>
            <div className={styles.layout}>
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

                    <div
                        className={`${styles.mainInner} ${
                            hideDefaultRightSidebar ? styles.mainInnerExpanded : ""
                        }`}
                    >
                        <main className={styles.content}>{children}</main>

                        {!hideDefaultRightSidebar && (
                            <aside className={styles.aside}>
                                <RightSidebar />
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}