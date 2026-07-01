import { create } from "zustand";

const AUTH_STORAGE_KEY = "corkairportdojo-auth";
const AUTH_MESSAGE_KEY = "corkairportdojo-auth-message";

interface AuthState {
    isAuthenticated: boolean;
    userName: string;
    authMessage: string | null;
    login: (userName?: string) => void;
    logout: () => void;
    hydrate: () => void;
    setAuthMessage: (message: string | null) => void;
    consumeAuthMessage: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: true,
    userName: "Chris Murphy",
    authMessage: null,

    login: (userName = "Chris Murphy") => {
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                isAuthenticated: true,
                userName,
            })
        );

        localStorage.removeItem(AUTH_MESSAGE_KEY);

        set({
            isAuthenticated: true,
            userName,
            authMessage: null,
        });
    },

    logout: () => {
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                isAuthenticated: false,
                userName: "",
            })
        );

        localStorage.setItem(
            AUTH_MESSAGE_KEY,
            "You have been signed out. Please log in again to continue."
        );

        set({
            isAuthenticated: false,
            userName: "",
            authMessage: "You have been signed out. Please log in again to continue.",
        });
    },

    hydrate: () => {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        const storedMessage = localStorage.getItem(AUTH_MESSAGE_KEY);

        if (!raw) {
            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({
                    isAuthenticated: true,
                    userName: "Chris Murphy",
                })
            );

            set({
                isAuthenticated: true,
                userName: "Chris Murphy",
                authMessage: storedMessage,
            });

            return;
        }

        try {
            const parsed = JSON.parse(raw) as {
                isAuthenticated?: boolean;
                userName?: string;
            };

            set({
                isAuthenticated: Boolean(parsed.isAuthenticated),
                userName: parsed.userName || "",
                authMessage: storedMessage,
            });
        } catch {
            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({
                    isAuthenticated: true,
                    userName: "Chris Murphy",
                })
            );

            set({
                isAuthenticated: true,
                userName: "Chris Murphy",
                authMessage: storedMessage,
            });
        }
    },

    setAuthMessage: (message) => {
        if (message) {
            localStorage.setItem(AUTH_MESSAGE_KEY, message);
        } else {
            localStorage.removeItem(AUTH_MESSAGE_KEY);
        }

        set({ authMessage: message });
    },

    consumeAuthMessage: () => {
        const message = localStorage.getItem(AUTH_MESSAGE_KEY);
        localStorage.removeItem(AUTH_MESSAGE_KEY);
        set({ authMessage: null });
        return message;
    },
}));