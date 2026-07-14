import { useEffect, useMemo, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    type TooltipProps,
} from "recharts";
import type { ResourceRecord } from "~/lib/api/resources";
import styles from "./ResourceOverviewChart.module.scss";

interface ResourceOverviewChartProps {
    resources: ResourceRecord[];
}

const PROVIDER_COLORS: Record<string, string> = {
    "Google Drive": "#8b5cf6",
    OneDrive: "#3b82f6",
    GitHub: "#22c55e",
    External: "#f59e0b",
};

function OverviewTooltip({
                             active,
                             payload,
                         }: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null;

    const item = payload[0]?.payload as
        | { provider: string; count: number; color: string }
        | undefined;

    if (!item) return null;

    return (
        <div className={styles.tooltip}>
            <div className={styles.tooltipTitle}>{item.provider}</div>
            <div className={styles.tooltipValue}>{item.count} resources</div>
        </div>
    );
}

function useAnimatedCount(target: number, duration = 900) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let frame = 0;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const nextValue = Math.round(target * easedProgress);

            setCount(nextValue);

            if (progress < 1) {
                frame = window.requestAnimationFrame(animate);
            }
        };

        setCount(0);
        frame = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, [target, duration]);

    return count;
}

export function ResourceOverviewChart({
                                          resources,
                                      }: ResourceOverviewChartProps) {
    const providerData = useMemo(() => {
        const grouped = resources.reduce<Record<string, number>>((acc, resource) => {
            acc[resource.provider] = (acc[resource.provider] ?? 0) + 1;
            return acc;
        }, {});

        return Object.entries(grouped).map(([provider, count]) => ({
            provider,
            count,
            color: PROVIDER_COLORS[provider] ?? "#94a3b8",
        }));
    }, [resources]);

    const totalResources = useMemo(
        () => providerData.reduce((sum, item) => sum + item.count, 0),
        [providerData]
    );

    const animatedTotal = useAnimatedCount(totalResources, 1000);

    return (
        <div className={styles.wrap}>
            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Tooltip content={<OverviewTooltip />} />
                        <Pie
                            data={providerData}
                            dataKey="count"
                            nameKey="provider"
                            innerRadius={68}
                            outerRadius={102}
                            paddingAngle={2}
                            stroke="transparent"
                            isAnimationActive
                            animationDuration={900}
                        >
                            {providerData.map((entry) => (
                                <Cell key={entry.provider} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className={styles.centerLabel}>
                    <strong>{animatedTotal}</strong>
                    <span>Total Resources</span>
                </div>
            </div>

            <div className={styles.legend}>
                {providerData.map((item) => (
                    <div key={item.provider} className={styles.legendRow}>
                        <div className={styles.legendLabel}>
                            <span
                                className={styles.legendDot}
                                style={{ backgroundColor: item.color }}
                            />
                            <span>{item.provider}</span>
                        </div>
                        <strong>{item.count}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}