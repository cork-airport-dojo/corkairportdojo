import { AlertTriangle } from "lucide-react";
import type { DojoClosureNotice } from "~/lib/constants/weather-warnings";
import { getWeatherAlertAccent } from "~/lib/constants/weather-warnings";
import styles from "./DojoClosureBanner.module.scss";

interface DojoClosureBannerProps {
    notice: DojoClosureNotice | null | undefined;
}

export function DojoClosureBanner({ notice }: DojoClosureBannerProps) {
    if (!notice?.shouldClose) return null;

    const accent = getWeatherAlertAccent(notice.level);

    return (
        <section
            className={styles.banner}
            style={{
                borderColor: accent.border,
                background: accent.surface,
            }}
        >
            <div className={styles.iconWrap} style={{ color: accent.text }}>
                <AlertTriangle size={18} />
            </div>

            <div className={styles.content}>
                <h2 style={{ color: accent.title }}>{notice.title}</h2>
                <p>{notice.message}</p>
            </div>
        </section>
    );
}