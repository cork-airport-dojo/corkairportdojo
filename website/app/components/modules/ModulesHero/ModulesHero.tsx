import styles from "./ModulesHero.module.scss";

export function ModulesHero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <span className={styles.eyebrow}>Modules</span>
                <h1 className={styles.title}>Explore structured learning modules.</h1>
                <p className={styles.description}>
                    Browse practical modules across frontend, backend, TypeScript,
                    security, databases and modern application development.
                </p>
            </div>
        </section>
    );
}