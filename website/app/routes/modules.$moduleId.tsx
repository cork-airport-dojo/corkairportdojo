import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ModulePage } from "~/components/modules/ModulePage/ModulePage";
import { useCustomModulesStore } from "~/store/use-custom-modules-store";
import { getAllModules } from "~/lib/get-all-modules";

export default function ModuleRoute() {
    const { moduleId } = useParams();
    const { modules: customModules, hydrate } = useCustomModulesStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const allModules = useMemo(() => getAllModules(customModules), [customModules]);

    const moduleItem = allModules.find((item) => item.id === moduleId);

    if (!moduleItem) {
        return (
            <AppShell>
                <div style={{ paddingBottom: "100px" }}>
                    <h1>Module not found</h1>
                    <p>The module you are looking for does not exist.</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <ModulePage module={moduleItem} />
        </AppShell>
    );
}