import { modules } from "~/lib/constants/modules";
import { ModuleCard } from "../ModuleCard/ModuleCard";
import styles from "./ModulesGrid.module.scss";

export function ModulesGrid() {
    return (
        <section className={styles.grid}>
            {modules.map((module) => (
                <ModuleCard
                    key={module.title}
                    title={module.title}
                    description={module.description}
                    lessons={module.lessons}
                    difficulty={module.difficulty}
                    icon={module.icon}
                />
            ))}
        </section>
    );
}