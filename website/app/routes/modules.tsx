import { useLoaderData, Link } from "react-router";
import { Layers3 } from "lucide-react";
import { useAuthStore } from "~/store/use-auth-store";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ModulesHero } from "~/components/modules/ModulesHero/ModulesHero";
import { ModulesToolbar } from "~/components/modules/ModulesToolbar/ModulesToolbar";
import { ModulesGrid } from "~/components/modules/ModulesGrid/ModulesGrid";
import { loadWeatherAlertData } from "~/lib/loaders/weather-loader";
import styles from "./modules.module.scss";

export async function loader() {
    return loadWeatherAlertData();
}

export default function ModulesRoute() {
    const { weatherAlert, closureNotice } = useLoaderData<typeof loader>();
    const { canManageContent } = useAuthStore();

    return (
        <AppShell weatherAlert={weatherAlert} closureNotice={closureNotice}>
            <div className={styles.page}>
                <div className={styles.heroWrap}>
                    <ModulesHero />

                    {canManageContent && (
                        <div className={styles.heroActionRow}>
                            <Link
                                to="/modules/new"
                                className={styles.headerAction}
                                aria-label="Create module"
                            >
                                <Layers3 size={16} />
                                <span>New Module</span>
                            </Link>
                        </div>
                    )}
                </div>

                <ModulesToolbar />
                <ModulesGrid />
            </div>
        </AppShell>
    );
}