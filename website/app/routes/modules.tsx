import { Link } from "react-router";
import { Layers3 } from "lucide-react";
import { useAuthStore } from "~/store/use-auth-store";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ModulesHero } from "~/components/modules/ModulesHero/ModulesHero";
import { ModulesGrid } from "~/components/modules/ModulesGrid/ModulesGrid";
import styles from "./modules.module.scss";

export default function ModulesRoute() {
    const { canManageContent } = useAuthStore();

    return (
        <AppShell>
            <div className={styles.page}>
                <div className={styles.heroWrap}>
                    <ModulesHero />
                    {canManageContent && (
                        <div className={styles.heroActionRow}>
                            <Link to="/modules/new" className={styles.headerAction} aria-label="Create module">
                                <Layers3 size={16} />
                                <span>New Module</span>
                            </Link>
                        </div>
                    )}
                </div>
                <ModulesGrid />
            </div>
        </AppShell>
    );
}