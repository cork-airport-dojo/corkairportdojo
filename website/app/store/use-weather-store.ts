import { create } from "zustand";
import type { CorkWeatherAlert } from "~/lib/constants/weather-warnings";
import { getCorkWeatherAlert } from "~/lib/constants/weather-warnings";

interface WeatherState {
    alert: CorkWeatherAlert | null;
    loading: boolean;
    hydrate: () => Promise<void>;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
    alert: null,
    loading: false,

    hydrate: async () => {
        if (get().loading || get().alert) return;

        set({ loading: true });

        try {
            const alert = await getCorkWeatherAlert();
            set({ alert, loading: false });
        } catch {
            set({ loading: false });
        }
    },
}));
