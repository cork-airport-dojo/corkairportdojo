import { useLoaderData, Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
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

export function shouldRevalidate() {
    return false;
}

export default function ModulesRoute() {
    const { weatherAlert, closureNotice } = useLoaderData<typeof loader>();
    const { isAuthenticated, role } = useAuthStore();

    const canManageContent =
        isAuthenticated && (role === "admin" || role === "editor");

    return (
        <AppShell weatherAlert={weatherAlert} closureNotice={closureNotice}>
            <div className={styles.page}>
                <ModulesHero />

                {canManageContent && (
                    <div className={styles.createRow}>
                        <Button
                            asChild
                            type="button"
                            size="icon"
                            className={styles.createButton}
                        >
                            <Link
                                to="/profile"
                                aria-label="Create module"
                                title="Create module"
                            >
                                <Plus size={18} />
                            </Link>
                        </Button>
                    </div>
                )}

                <ModulesToolbar />
                <ModulesGrid />
            </div>
        </AppShell>
    );
}