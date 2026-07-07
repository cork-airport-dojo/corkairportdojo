import { create } from "zustand";

const NOTICES_STORAGE_KEY = "corkairportdojo-notices";

export type NoticeSeverity = "info" | "warning" | "closure";

export interface ImportantNotice {
    id: string;
    message: string;
    severity: NoticeSeverity;
    pinned: boolean;
    startAt: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

interface NoticesState {
    notices: ImportantNotice[];
    editingNoticeId: string | null;
    hydrate: () => void;
    addNotice: (input: {
        message: string;
        severity: NoticeSeverity;
        pinned: boolean;
        startAt: string;
        expiresAt: string;
    }) => void;
    updateNotice: (
        id: string,
        input: {
            message: string;
            severity: NoticeSeverity;
            pinned: boolean;
            startAt: string;
            expiresAt: string;
        }
    ) => void;
    removeNotice: (id: string) => void;
    togglePinned: (id: string) => void;
    setEditingNoticeId: (id: string | null) => void;
    clearInactiveNotices: () => void;
    getVisibleNotices: () => ImportantNotice[];
}

function isValidDate(value: string) {
    const time = new Date(value).getTime();
    return Number.isFinite(time);
}

function normalizeSeverity(value: unknown): NoticeSeverity {
    if (value === "warning" || value === "closure") return value;
    return "info";
}

function normalizeNotice(raw: unknown): ImportantNotice | null {
    if (!raw || typeof raw !== "object") return null;

    const notice = raw as Partial<ImportantNotice>;

    if (!notice.id || !notice.message) return null;
    if (!notice.startAt || !notice.expiresAt) return null;
    if (!isValidDate(notice.startAt) || !isValidDate(notice.expiresAt)) return null;

    return {
        id: String(notice.id),
        message: String(notice.message),
        severity: normalizeSeverity(notice.severity),
        pinned: Boolean(notice.pinned),
        startAt: String(notice.startAt),
        expiresAt: String(notice.expiresAt),
        createdAt:
            notice.createdAt && isValidDate(notice.createdAt)
                ? String(notice.createdAt)
                : new Date().toISOString(),
        updatedAt:
            notice.updatedAt && isValidDate(notice.updatedAt)
                ? String(notice.updatedAt)
                : new Date().toISOString(),
    };
}

function readStoredNotices(): ImportantNotice[] {
    const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((item) => normalizeNotice(item))
            .filter((item): item is ImportantNotice => item !== null);
    } catch {
        return [];
    }
}

function writeStoredNotices(notices: ImportantNotice[]) {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
}

function severityRank(severity: NoticeSeverity) {
    if (severity === "closure") return 3;
    if (severity === "warning") return 2;
    return 1;
}

function isNoticeVisible(notice: ImportantNotice) {
    const now = Date.now();
    const startAt = new Date(notice.startAt).getTime();
    const expiresAt = new Date(notice.expiresAt).getTime();

    return Number.isFinite(startAt) && Number.isFinite(expiresAt) && startAt <= now && expiresAt > now;
}

export const useNoticesStore = create<NoticesState>((set, get) => ({
    notices: [],
    editingNoticeId: null,

    hydrate: () => {
        const stored = readStoredNotices();
        writeStoredNotices(stored);
        set({ notices: stored });
    },

    addNotice: ({ message, severity, pinned, startAt, expiresAt }) => {
        const trimmed = message.trim();
        if (!trimmed || !isValidDate(startAt) || !isValidDate(expiresAt)) return;

        const nextNotice: ImportantNotice = {
            id: crypto.randomUUID(),
            message: trimmed,
            severity,
            pinned,
            startAt: new Date(startAt).toISOString(),
            expiresAt: new Date(expiresAt).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const next = [...get().notices, nextNotice];
        writeStoredNotices(next);
        set({ notices: next });
    },

    updateNotice: (id, { message, severity, pinned, startAt, expiresAt }) => {
        const trimmed = message.trim();
        if (!trimmed || !isValidDate(startAt) || !isValidDate(expiresAt)) return;

        const next = get().notices.map((notice) =>
            notice.id === id
                ? {
                    ...notice,
                    message: trimmed,
                    severity,
                    pinned,
                    startAt: new Date(startAt).toISOString(),
                    expiresAt: new Date(expiresAt).toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                : notice
        );

        writeStoredNotices(next);
        set({
            notices: next,
            editingNoticeId: null,
        });
    },

    removeNotice: (id) => {
        const next = get().notices.filter((notice) => notice.id !== id);
        writeStoredNotices(next);
        set({ notices: next });
    },

    togglePinned: (id) => {
        const next = get().notices.map((notice) =>
            notice.id === id
                ? {
                    ...notice,
                    pinned: !notice.pinned,
                    updatedAt: new Date().toISOString(),
                }
                : notice
        );

        writeStoredNotices(next);
        set({ notices: next });
    },

    setEditingNoticeId: (id) => set({ editingNoticeId: id }),

    clearInactiveNotices: () => {
        const now = Date.now();

        const next = get().notices.filter((notice) => {
            const expiresAt = new Date(notice.expiresAt).getTime();
            return Number.isFinite(expiresAt) && expiresAt > now;
        });

        writeStoredNotices(next);
        set({ notices: next });
    },

    getVisibleNotices: () => {
        return [...get().notices]
            .filter(isNoticeVisible)
            .sort((a, b) => {
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

                const severityDiff = severityRank(b.severity) - severityRank(a.severity);
                if (severityDiff !== 0) return severityDiff;

                return (
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            });
    },
}));