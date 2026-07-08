import type { CorkWeatherAlert } from "~/lib/constants/weather-warnings";

export async function fetchWeather(): Promise<CorkWeatherAlert | null> {
    const response = await fetch("/api/weather");

    if (!response.ok) {
        throw new Error("Failed to fetch weather");
    }

    const payload = (await response.json()) as { weather?: CorkWeatherAlert | null };
    return payload.weather ?? null;
}