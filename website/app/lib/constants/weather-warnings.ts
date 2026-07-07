export interface MetEireannWarning {
    id?: number;
    capId?: string;
    type?: string;
    severity?: string;
    certainty?: string;
    level?: string;
    issued?: string;
    updated?: string;
    onset?: string;
    expiry?: string;
    headline?: string;
    description?: string;
    regions?: string[];
    status?: string;
}

export type WeatherAlertLevel = "yellow" | "orange" | "red" | null;
/*const FORCE_WEATHER_ALERT: "red" | "orange" | "yellow" | null = "red";*/
const FORCE_WEATHER_ALERT = null;

export interface CorkWeatherAlert {
    hasAlert: boolean;
    headline: string;
    description: string;
    level: WeatherAlertLevel;
    type: string | null;
    issued: string | null;
    onset: string | null;
    expiry: string | null;
    sourceUrl: string;
}

export interface DojoClosureNotice {
    shouldClose: boolean;
    title: string;
    message: string;
    level: WeatherAlertLevel;
}

const CORK_FIPS_CODE = "EI04";
const CORK_WARNING_URL = "https://www.met.ie/Open_Data/json/warning_EI04.json";
const CORK_WARNING_PAGE_URL = "https://www.met.ie/warnings/today/cork";

const levelPriority: Record<Exclude<WeatherAlertLevel, null>, number> = {
    red: 3,
    orange: 2,
    yellow: 1,
};

function normalizeLevel(level?: string): WeatherAlertLevel {
    const value = level?.trim().toLowerCase();

    if (value === "yellow" || value === "orange" || value === "red") {
        return value;
    }

    return null;
}

function normalizeWarnings(payload: unknown): MetEireannWarning[] {
    if (Array.isArray(payload)) return payload as MetEireannWarning[];

    if (
        payload &&
        typeof payload === "object" &&
        "warnings" in payload &&
        Array.isArray((payload as { warnings?: unknown[] }).warnings)
    ) {
        return (payload as { warnings: MetEireannWarning[] }).warnings;
    }

    return [];
}

function isCorkWarning(warning: MetEireannWarning) {
    return warning.regions?.includes(CORK_FIPS_CODE);
}

function compareWarnings(a: MetEireannWarning, b: MetEireannWarning) {
    const levelA = levelPriority[normalizeLevel(a.level) ?? "yellow"] ?? 0;
    const levelB = levelPriority[normalizeLevel(b.level) ?? "yellow"] ?? 0;

    if (levelA !== levelB) return levelB - levelA;

    const onsetA = a.onset ? new Date(a.onset).getTime() : 0;
    const onsetB = b.onset ? new Date(b.onset).getTime() : 0;

    return onsetB - onsetA;
}

export function formatWeatherDateTime(value: string | null) {
    if (!value) return null;

    try {
        return new Intl.DateTimeFormat("en-IE", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
}


export function getWeatherAlertAccent(level: WeatherAlertLevel) {
    if (level === "red") {
        return {
            border: "rgba(239, 68, 68, 0.55)",
            text: "#fca5a5",
            title: "#fecaca",
            surface: "rgba(239, 68, 68, 0.08)",
        };
    }

    if (level === "orange") {
        return {
            border: "rgba(249, 115, 22, 0.55)",
            text: "#fdba74",
            title: "#ffedd5",
            surface: "rgba(249, 115, 22, 0.08)",
        };
    }

    return {
        border: "rgba(245, 158, 11, 0.5)",
        text: "#f59e0b",
        title: "#ffd08a",
        surface: "rgba(245, 158, 11, 0.08)",
    };
}

export function getDojoClosureNotice(
    alert: CorkWeatherAlert | null | undefined
): DojoClosureNotice {
    const level = alert?.level ?? null;

    if (!alert?.hasAlert || !level) {
        return {
            shouldClose: false,
            title: "",
            message: "",
            level,
        };
    }

    const now = Date.now();
    const twoDaysFromNow = now + 1000 * 60 * 60 * 24 * 2;
    const onsetTime = alert.onset ? new Date(alert.onset).getTime() : null;

    const redWithinTwoDays =
        level === "red" &&
        onsetTime !== null &&
        onsetTime <= twoDaysFromNow;

    if (!redWithinTwoDays) {
        return {
            shouldClose: false,
            title: "",
            message: "",
            level,
        };
    }

    if (onsetTime > now) {
        return {
            shouldClose: true,
            title: "CorkAirportDojo will close due to an upcoming Red weather alert",
            message:
                "A Red weather alert is expected within the next 2 days. Students should prepare to stay at home and follow further updates.",
            level,
        };
    }

    return {
        shouldClose: true,
        title: "CorkAirportDojo is closed due to a Red weather alert",
        message:
            "Students should stay at home until the warning has passed and it is safe to travel again.",
        level,
    };
}

export async function getCorkWeatherAlert(): Promise<CorkWeatherAlert> {
    if (FORCE_WEATHER_ALERT) {
        return {
            hasAlert: true,
            headline:
                FORCE_WEATHER_ALERT === "red"
                    ? "Red Wind Warning"
                    : FORCE_WEATHER_ALERT === "orange"
                        ? "Orange Wind Warning"
                        : "Yellow Wind Warning",
            description:
                FORCE_WEATHER_ALERT === "red"
                    ? "Severe dangerous weather conditions. CorkAirportDojo is closed and students should stay at home."
                    : FORCE_WEATHER_ALERT === "orange"
                        ? "High-impact weather conditions expected. CorkAirportDojo is closed and students should stay at home."
                        : "Weather conditions may cause local disruption in Cork.",
            level: FORCE_WEATHER_ALERT,
            type: "Wind",
            issued: new Date().toISOString(),
            onset: new Date().toISOString(),
            /*onset: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),*/
            expiry: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
            sourceUrl: "https://www.met.ie/warnings/today/cork",
        };
    }

    try {
        const response = await fetch(CORK_WARNING_URL, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            return {
                hasAlert: false,
                headline: "Unable to load weather alerts",
                description: "The current weather warning feed could not be loaded.",
                level: null,
                type: null,
                issued: null,
                onset: null,
                expiry: null,
                sourceUrl: CORK_WARNING_PAGE_URL,
            };
        }

        const payload = await response.json();
        const warnings = normalizeWarnings(payload);
        const corkWarnings = warnings.filter(isCorkWarning).sort(compareWarnings);

        if (!corkWarnings.length) {
            return {
                hasAlert: false,
                headline: "No active weather alerts",
                description: "There are currently no active weather alerts for Cork, Ireland.",
                level: null,
                type: null,
                issued: null,
                onset: null,
                expiry: null,
                sourceUrl: CORK_WARNING_PAGE_URL,
            };
        }

        const topWarning = corkWarnings[0];

        return {
            hasAlert: true,
            headline: topWarning.headline || "Active weather warning",
            description:
                topWarning.description ||
                "A weather alert is currently active for Cork, Ireland.",
            level: normalizeLevel(topWarning.level),
            type: topWarning.type || null,
            issued: topWarning.issued || null,
            onset: topWarning.onset || null,
            expiry: topWarning.expiry || null,
            sourceUrl: CORK_WARNING_PAGE_URL,
        };
    } catch {
        return {
            hasAlert: false,
            headline: "Unable to load weather alerts",
            description: "The current weather warning feed could not be loaded.",
            level: null,
            type: null,
            issued: null,
            onset: null,
            expiry: null,
            sourceUrl: CORK_WARNING_PAGE_URL,
        };
    }
}