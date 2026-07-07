import {
    getCorkWeatherAlert,
    getDojoClosureNotice,
} from "~/lib/constants/weather-warnings";

export async function loadWeatherAlertData() {
    const weatherAlert = await getCorkWeatherAlert();
    const closureNotice = getDojoClosureNotice(weatherAlert);

    return {
        weatherAlert,
        closureNotice,
    };
}