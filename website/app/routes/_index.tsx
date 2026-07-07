import { useLoaderData } from "react-router";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { HomePage } from "~/components/home/HomePage/HomePage";
import { loadWeatherAlertData } from "~/lib/loaders/weather-loader";

export async function loader() {
    return loadWeatherAlertData();
}

export function shouldRevalidate() {
    return false;
}

export default function IndexRoute() {
    const { weatherAlert, closureNotice } = useLoaderData<typeof loader>();

    return (
        <AppShell weatherAlert={weatherAlert} closureNotice={closureNotice}>
            <HomePage />
        </AppShell>
    );
}