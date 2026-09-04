import { create } from "zustand";
import {
    fetchHeroCTAButtons,
    insertHeroCTAButton,
    updateHeroCTAButton,
    deleteHeroCTAButton,
} from "~/lib/api/hero-cta-buttons";

export type HeroButtonVariant = "primary" | "secondary" | "outline";

export interface HeroCTAButton {
    id: string;
    label: string;
    href: string;
    enabled: boolean;
    variant: HeroButtonVariant;
    order: number;
}

interface HeroCTAState {
    buttons: HeroCTAButton[];
    hydrate: () => Promise<void>;
    addButton: (input: Omit<HeroCTAButton, "id">) => Promise<void>;
    updateButton: (id: string, input: Omit<HeroCTAButton, "id">) => Promise<void>;
    removeButton: (id: string) => Promise<void>;
    toggleEnabled: (id: string) => Promise<void>;
    moveButtonUp: (id: string) => Promise<void>;
    moveButtonDown: (id: string) => Promise<void>;
    getVisibleButtons: () => HeroCTAButton[];
}

function sortButtons(buttons: HeroCTAButton[]) {
    return [...buttons].sort((a, b) => a.order - b.order);
}

export const useHeroCTAStore = create<HeroCTAState>((set, get) => ({
    buttons: [],

    hydrate: async () => {
        const buttons = await fetchHeroCTAButtons();
        set({ buttons: sortButtons(buttons) });
    },

    addButton: async (input) => {
        const next = await insertHeroCTAButton(input);
        set({ buttons: sortButtons([...get().buttons, next]) });
    },

    updateButton: async (id, input) => {
        const updated = await updateHeroCTAButton(id, input);
        const buttons = sortButtons(
            get().buttons.map((b) => (b.id === id ? updated : b))
        );
        set({ buttons });
    },

    removeButton: async (id) => {
        await deleteHeroCTAButton(id);
        set({ buttons: sortButtons(get().buttons.filter((b) => b.id !== id)) });
    },

    toggleEnabled: async (id) => {
        const button = get().buttons.find((b) => b.id === id);
        if (!button) return;
        const updated = await updateHeroCTAButton(id, { enabled: !button.enabled });
        const buttons = sortButtons(
            get().buttons.map((b) => (b.id === id ? updated : b))
        );
        set({ buttons });
    },

    moveButtonUp: async (id) => {
        const buttons = sortButtons([...get().buttons]);
        const index = buttons.findIndex((b) => b.id === id);
        if (index <= 0) return;

        const current = buttons[index];
        const previous = buttons[index - 1];

        await Promise.all([
            updateHeroCTAButton(current.id, { order: previous.order }),
            updateHeroCTAButton(previous.id, { order: current.order }),
        ]);

        const fresh = await fetchHeroCTAButtons();
        set({ buttons: sortButtons(fresh) });
    },

    moveButtonDown: async (id) => {
        const buttons = sortButtons([...get().buttons]);
        const index = buttons.findIndex((b) => b.id === id);
        if (index === -1 || index >= buttons.length - 1) return;

        const current = buttons[index];
        const nextButton = buttons[index + 1];

        await Promise.all([
            updateHeroCTAButton(current.id, { order: nextButton.order }),
            updateHeroCTAButton(nextButton.id, { order: current.order }),
        ]);

        const fresh = await fetchHeroCTAButtons();
        set({ buttons: sortButtons(fresh) });
    },

    getVisibleButtons: () => {
        return sortButtons(get().buttons).filter((b) => b.enabled);
    },
}));
