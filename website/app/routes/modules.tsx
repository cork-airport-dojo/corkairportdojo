import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ModulesHero } from "~/components/modules/ModulesHero/ModulesHero";
import { ModulesToolbar } from "~/components/modules/ModulesToolbar/ModulesToolbar";
import { ModulesGrid } from "~/components/modules/ModulesGrid/ModulesGrid";
import styles from "./modules.module.scss";

export default function ModulesRoute() {
    return (
        <AppShell hideDefaultRightSidebar>
            <div className={styles.page}>
                <ModulesHero />
                <ModulesToolbar />
                <ModulesGrid />
            </div>
        </AppShell>
    );
}