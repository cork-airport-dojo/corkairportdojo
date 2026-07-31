import {
    getCorkWeatherAlert,
    getDojoClosureNotice,
    type CorkWeatherAlert,
    type DojoClosureNotice,
} from "~/lib/constants/weather-warnings";

export interface WeatherAlertData {
    weatherAlert: CorkWeatherAlert | null;
    closureNotice: DojoClosureNotice | null;
}

export async function fetchWeatherAlertData(): Promise<WeatherAlertData> {
    const weatherAlert = await getCorkWeatherAlert();
    const closureNotice = getDojoClosureNotice(weatherAlert);
    return { weatherAlert, closureNotice };
}
