import { useEffect, useState } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ModuleCard } from "../ModuleCard/ModuleCard";
import { fetchModules, type PublicModule } from "~/lib/api/modules";
import styles from "./ModulesGrid.module.scss";
import type { ModuleDifficulty } from "~/lib/constants/modules";
import type { IconName } from "lucide-react/dynamic";

function ModulesLoadingState() {
    return (
        <section className={styles.grid}>
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className={styles.card}>
                    <CardContent className={styles.cardBody}>
                        <div className={styles.skeletonBadge} />
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonFooter} />
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}

function ModulesErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <Card className={styles.stateCard}>
            <CardHeader className={styles.stateHeader}>
                <div className={styles.stateIconWrap}>
                    <RefreshCw size={18} />
                </div>
                <div>
                    <h2>Unable to load modules</h2>
                    <p>There was a problem loading module content right now.</p>
                </div>
            </CardHeader>

            <CardContent className={styles.stateBody}>
                <button type="button" className={styles.retryButton} onClick={onRetry}>
                    Try Again
                </button>
            </CardContent>
        </Card>
    );
}

function ModulesEmptyState() {
    return (
        <Card className={styles.stateCard}>
            <CardHeader className={styles.stateHeader}>
                <div className={styles.stateIconWrap}>
                    <BookOpen size={18} />
                </div>
                <div>
                    <h2>No modules yet</h2>
                    <p>Published modules will appear here once they have been created.</p>
                </div>
            </CardHeader>
        </Card>
    );
}

export function ModulesGrid() {
    const [modules, setModules] = useState<PublicModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadModules = async () => {
        setLoading(true);
        setError(false);

        try {
            const data = await fetchModules();
            setModules(data);
        } catch (err) {
            console.error("Failed to load modules:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadModules();
    }, []);

    if (loading) {
        return <ModulesLoadingState />;
    }

    if (error) {
        return <ModulesErrorState onRetry={() => void loadModules()} />;
    }

    if (modules.length === 0) {
        return <ModulesEmptyState />;
    }

    return (
        <section className={styles.grid}>
            {modules.map((module) => {
                // const icon = moduleIconMap.react;

                return (
                    <ModuleCard
                        key={module.id}
                        id={module.slug}
                        title={module.title}
                        description={module.description ?? ""}
                        difficulty={module.difficulty as ModuleDifficulty ?? ""}
                        icon_key={module.icon_key as IconName ?? "hammer"}
                    />
                );
            })}
        </section>
    );
}