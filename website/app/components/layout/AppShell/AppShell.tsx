import { useState } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { RightSidebar } from "../RightSidebar/RightSidebar";
import styles from "./AppShell.module.scss";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
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
                    <div className={styles.mainInner}>
                        <main className={styles.content}>
                            <Header
                                sidebarCollapsed={sidebarCollapsed}
                                onToggleSidebarCollapse={() =>
                                    setSidebarCollapsed((value) => !value)
                                }
                            />
                            {children}
                        </main>

                        <aside className={styles.aside}>
                            <RightSidebar />
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}