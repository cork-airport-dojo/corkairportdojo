import { AppShell } from "~/components/layout/AppShell/AppShell";
import { HomePage } from "~/components/home/HomePage/HomePage";

export default function IndexRoute() {
    return (
        <AppShell>
            <HomePage />
        </AppShell>
    );
}