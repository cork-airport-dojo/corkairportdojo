import { useEffect, useMemo } from "react";
import { ModuleCard } from "../ModuleCard/ModuleCard";
import { useCustomModulesStore } from "~/store/use-custom-modules-store";
import { getAllModules } from "~/lib/get-all-modules";
import styles from "./ModulesGrid.module.scss";

export function ModulesGrid() {
    const { modules: customModules, hydrate } = useCustomModulesStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const allModules = useMemo(() => getAllModules(customModules), [customModules]);

    return (
        <section className={styles.grid}>
            {allModules.map((module) => (
                <ModuleCard
                    key={module.id}
                    id={module.id}
                    title={module.title}
                    description={module.description}
                    difficulty={module.difficulty}
                    lessons={module.lessons}
                    icon={module.icon}
                />
            ))}
        </section>
    );
}