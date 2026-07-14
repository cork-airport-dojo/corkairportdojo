import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ResourcesPage } from "~/components/resources/ResourcesPage/ResourcesPage";

export default function ResourcesRoute() {
    return (
        <AppShell hideDefaultRightSidebar>
            <ResourcesPage />
        </AppShell>
    );
}