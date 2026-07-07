import { useLoaderData } from "react-router";
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

    return (
        <AppShell weatherAlert={weatherAlert} closureNotice={closureNotice}>
            <div className={styles.page}>
                <ModulesHero />
                <ModulesToolbar />
                <ModulesGrid />
            </div>
        </AppShell>
    );
}