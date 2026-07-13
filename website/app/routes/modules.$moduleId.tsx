import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AppShell } from "~/components/layout/AppShell/AppShell";
import { ModulePage } from "~/components/modules/ModulePage/ModulePage";
import { fetchModuleBySlug, type PublicModule } from "~/lib/api/modules";
import { moduleIconMap } from "~/lib/modules";

export default function ModuleRoute() {
    const { moduleId } = useParams();
    const [moduleItem, setModuleItem] = useState<PublicModule | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!moduleId) return;

        const loadModule = async () => {
            setLoading(true);

            try {
                const module = await fetchModuleBySlug(moduleId);
                setModuleItem(module);
            } catch (error) {
                console.error("Failed to load module:", error);
                setModuleItem(null);
            } finally {
                setLoading(false);
            }
        };

        void loadModule();
    }, [moduleId]);

    if (loading) {
        return (
            <AppShell>
                <div style={{ paddingBottom: "100px" }}>
                    <h1>Loading module...</h1>
                </div>
            </AppShell>
        );
    }

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

    const icon =  moduleIconMap.react;

    return (
        <AppShell>
            <ModulePage
                module={{
                    id: moduleItem.slug,
                    title: moduleItem.title,
                    description: moduleItem.description ?? "",
                    lessons: moduleItem.lessons,
                    difficulty: moduleItem.difficulty ?? "Beginner",
                    topic: moduleItem.topic ?? "",
                    icon,
                    featured: moduleItem.featured,
                    views: moduleItem.views,
                    overview: moduleItem.overview ?? [],
                }}
            />
        </AppShell>
    );
}