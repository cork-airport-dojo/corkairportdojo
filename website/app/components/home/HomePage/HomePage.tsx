import { HeroSection } from "../HeroSection/HeroSection";
import { LatestArticlesSection } from "../LatestArticlesSection/LatestArticlesSection";
import styles from "./HomePage.module.scss";
import {FeaturedModulesSection} from "../FeaturedModulesSection/FeaturedModulesSection";

export function HomePage() {
    return (
        <div className={styles.page}>
            <HeroSection />
            <FeaturedModulesSection />
            <LatestArticlesSection />
        </div>
    );
}