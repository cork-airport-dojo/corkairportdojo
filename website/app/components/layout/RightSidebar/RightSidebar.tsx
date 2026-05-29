import styles from "./RightSidebar.module.scss";

export function RightSidebar() {
    return (
        <div className={styles.rail}>
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>Popular Modules</h3>
                    <span>View all</span>
                </div>
                <p className={styles.placeholder}>Right sidebar widgets go here.</p>
            </section>
        </div>
    );
}