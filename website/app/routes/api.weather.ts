import { data } from "react-router";
import { getWeatherAlert } from "~/lib/api/weather.server";

export async function loader() {
    const weather = await getWeatherAlert();
    return data({ weather });
}