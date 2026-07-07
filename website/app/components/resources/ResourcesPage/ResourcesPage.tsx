import { resources } from "~/lib/constants/resources";
import { ResourceCard } from "../ResourceCard/ResourceCard";
import styles from "./ResourcesPage.module.scss";

export function ResourcesPage() {
    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>Resources</span>
                    <h1 className={styles.title}>Downloadable resources and supporting materials.</h1>
                    <p className={styles.description}>
                        Browse practical reference material, downloadable assets and linked resources
                        that support articles and learning modules across the platform.
                    </p>
                </div>
            </section>

            <section className={styles.grid}>
                {resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </section>
        </div>
    );
}