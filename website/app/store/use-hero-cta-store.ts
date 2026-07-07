import { create } from "zustand";

const HERO_CTA_STORAGE_KEY = "corkairportdojo-hero-cta-buttons";

export type HeroButtonVariant = "primary" | "secondary" | "outline";

export interface HeroCTAButton {
    id: string;
    label: string;
    href: string;
    enabled: boolean;
    variant: HeroButtonVariant;
    order: number;
    isCustom: boolean;
}

interface HeroCTAState {
    buttons: HeroCTAButton[];
    hydrate: () => void;
    resetDefaults: () => void;
    addButton: (input: Omit<HeroCTAButton, "id" | "isCustom">) => void;
    updateButton: (id: string, input: Omit<HeroCTAButton, "id" | "isCustom">) => void;
    removeButton: (id: string) => void;
    toggleEnabled: (id: string) => void;
    moveButtonUp: (id: string) => void;
    moveButtonDown: (id: string) => void;
    getVisibleButtons: () => HeroCTAButton[];
}

const defaultButtons: HeroCTAButton[] = [
    {
        id: "browse-modules",
        label: "Browse Modules",
        href: "/modules",
        enabled: true,
        variant: "primary",
        order: 1,
        isCustom: false,
    },
    {
        id: "read-articles",
        label: "Read Articles",
        href: "/blog",
        enabled: true,
        variant: "outline",
        order: 2,
        isCustom: false,
    },
    {
        id: "register-next-term",
        label: "Register next term",
        href: "/login",
        enabled: true,
        variant: "secondary",
        order: 3,
        isCustom: false,
    },
];

function readStoredButtons(): HeroCTAButton[] {
    const raw = localStorage.getItem(HERO_CTA_STORAGE_KEY);
    if (!raw) return defaultButtons;

    try {
        const parsed = JSON.parse(raw) as HeroCTAButton[];
        return Array.isArray(parsed) && parsed.length ? parsed : defaultButtons;
    } catch {
        return defaultButtons;
    }
}

function writeStoredButtons(buttons: HeroCTAButton[]) {
    localStorage.setItem(HERO_CTA_STORAGE_KEY, JSON.stringify(buttons));
}

function sortButtons(buttons: HeroCTAButton[]) {
    return [...buttons].sort((a, b) => a.order - b.order);
}

export const useHeroCTAStore = create<HeroCTAState>((set, get) => ({
    buttons: defaultButtons,

    hydrate: () => {
        set({ buttons: sortButtons(readStoredButtons()) });
    },

    resetDefaults: () => {
        writeStoredButtons(defaultButtons);
        set({ buttons: sortButtons(defaultButtons) });
    },

    addButton: (input) => {
        const next: HeroCTAButton = {
            id: crypto.randomUUID(),
            label: input.label.trim(),
            href: input.href.trim(),
            enabled: input.enabled,
            variant: input.variant,
            order: input.order,
            isCustom: true,
        };

        const buttons = sortButtons([...get().buttons, next]);
        writeStoredButtons(buttons);
        set({ buttons });
    },

    updateButton: (id, input) => {
        const buttons = sortButtons(
            get().buttons.map((button) =>
                button.id === id
                    ? {
                        ...button,
                        label: input.label.trim(),
                        href: input.href.trim(),
                        enabled: input.enabled,
                        variant: input.variant,
                        order: input.order,
                    }
                    : button
            )
        );

        writeStoredButtons(buttons);
        set({ buttons });
    },

    removeButton: (id) => {
        const buttons = get().buttons.filter((button) => button.id !== id);
        writeStoredButtons(buttons);
        set({ buttons: sortButtons(buttons) });
    },

    toggleEnabled: (id) => {
        const buttons = get().buttons.map((button) =>
            button.id === id ? { ...button, enabled: !button.enabled } : button
        );

        writeStoredButtons(buttons);
        set({ buttons: sortButtons(buttons) });
    },

    moveButtonUp: (id) => {
        const buttons = sortButtons([...get().buttons]);
        const index = buttons.findIndex((button) => button.id === id);
        if (index <= 0) return;

        const current = buttons[index];
        const previous = buttons[index - 1];

        current.order = previous.order;
        previous.order += 1;

        const next = sortButtons([...buttons]);
        writeStoredButtons(next);
        set({ buttons: next });
    },

    moveButtonDown: (id) => {
        const buttons = sortButtons([...get().buttons]);
        const index = buttons.findIndex((button) => button.id === id);
        if (index === -1 || index >= buttons.length - 1) return;

        const current = buttons[index];
        const nextButton = buttons[index + 1];

        current.order = nextButton.order;
        nextButton.order -= 1;

        const next = sortButtons([...buttons]);
        writeStoredButtons(next);
        set({ buttons: next });
    },

    getVisibleButtons: () => {
        return sortButtons(get().buttons).filter((button) => button.enabled);
    },
}));