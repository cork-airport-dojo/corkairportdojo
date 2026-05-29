import type { PropsWithChildren } from "react";
import { Header } from "../Header/Header";
import { PageContainer } from "../PageContainer/PageContainer";
import { RightSidebar } from "../RightSidebar/RightSidebar";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./AppShell.module.scss";

export function AppShell({ children }: PropsWithChildren) {
    return (
        <div className={styles.shell}>
            <aside className={styles.leftColumn}>
                <Sidebar />
            </aside>

            <div className={styles.desktopArea}>
                <div className={styles.topHeader}>
                    <Header />
                </div>

                <div className={styles.contentArea}>
                    <main className={styles.mainColumn}>
                        <PageContainer>{children}</PageContainer>
                    </main>

                    <aside className={styles.rightColumn}>
                        <RightSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}