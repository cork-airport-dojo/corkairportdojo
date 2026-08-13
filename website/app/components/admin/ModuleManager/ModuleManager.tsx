import { useEffect } from "react";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { StatusPill } from "~/components/admin/StatusPill/StautsPill";
import { useAuthStore } from "~/store/use-auth-store";
import { useProfileModulesStore } from "~/store/use-profile-modules-store";
import styles from "./ModuleManager.module.scss";

export function ModuleManager() {
    const { role } = useAuthStore();
    const { modules, isLoading, error, hydrate, removeModule } =
        useProfileModulesStore();

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.titleRow}>
                    <div className={styles.iconWrap}>
                        <BookOpen size={16} />
                    </div>

                    <div>
                        <h2>Manage Modules</h2>
                        <p className={styles.subtitle}>
                            {role === "admin"
                                ? "You can see all modules, including drafts."
                                : "You can see only modules you created, including drafts."}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className={styles.body}>
                {isLoading && (
                    <div className={styles.emptyState}>Loading modules...</div>
                )}

                {!isLoading && error && (
                    <div className={styles.emptyState}>{error}</div>
                )}

                {!isLoading && !error && modules.length === 0 && (
                    <div className={styles.emptyState}>
                        No modules available for your account yet.
                    </div>
                )}

                {!isLoading && !error && modules.length > 0 && (
                    <div className={styles.moduleList}>
                        {modules.map((module) => (
                            <div key={module.id} className={styles.moduleItem}>
                                <div className={styles.moduleText}>
                                    <div className={styles.moduleMetaRow}>
                                        <span className={styles.badge}>
                                            {module.difficulty}
                                        </span>

                                        {module.featured && (
                                            <span className={styles.badge}>Featured</span>
                                        )}

                                        <StatusPill published={module.published} />
                                    </div>

                                    <strong>{module.title}</strong>

                                    {module.description && (
                                        <span>{module.description}</span>
                                    )}
                                </div>

                                <div className={styles.moduleActions}>
                                    <Button asChild type="button" variant="outline" size="icon">
                                        <Link
                                            to={`/modules/${module.slug}/edit`}
                                            aria-label="Edit module"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => void removeModule(module.id)}
                                        aria-label="Delete module"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}