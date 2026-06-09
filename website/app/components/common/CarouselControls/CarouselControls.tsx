import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import styles from "./CarouselControls.module.scss";

export function CarouselControls() {
    return (
        <div className={styles.controls}>
            <Button variant="outline" size="icon" className={styles.controlButton} type="button">
                <ChevronLeft size={18} />
            </Button>
            <Button variant="outline" size="icon" className={styles.controlButton} type="button">
                <ChevronRight size={18} />
            </Button>
        </div>
    );
}