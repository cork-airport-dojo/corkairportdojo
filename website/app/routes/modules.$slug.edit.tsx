import { AuthGuard } from "~/components/auth/AuthGuard/AuthGuard";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ModuleEditorPage } from "~/components/modules/ModuleEditorPage/ModuleEditorPage";

export default function EditModuleRoute() {
    return (
        <AuthGuard>
            <AppShell hideDefaultRightSidebar>
                <ModuleEditorPage />
            </AppShell>
        </AuthGuard>
    );
}