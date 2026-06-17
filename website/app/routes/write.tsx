import { AppShell } from "~/components/layout/AppShell/AppShell";
import { WritePostPage } from "~/components/write/WritePostPage/WritePostPage";

export default function WriteRoute() {
    return (
        <AppShell hideDefaultRightSidebar>
            <WritePostPage />
        </AppShell>
    );
}