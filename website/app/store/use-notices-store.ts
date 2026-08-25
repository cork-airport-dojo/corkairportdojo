import { create } from "zustand";
import { supabase } from "~/lib/supabase/browser";

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
    hydrate: () => Promise<void>;
    addNotice: (input: {
        message: string;
        severity: NoticeSeverity;
        pinned: boolean;
        startAt: string;
        expiresAt: string;
    }) => Promise<void>;
    updateNotice: (
        id: string,
        input: {
            message: string;
            severity: NoticeSeverity;
            pinned: boolean;
            startAt: string;
            expiresAt: string;
        }
    ) => Promise<void>;
    removeNotice: (id: string) => Promise<void>;
    togglePinned: (id: string) => Promise<void>;
    setEditingNoticeId: (id: string | null) => void;
    clearInactiveNotices: () => Promise<void>;
    getVisibleNotices: () => ImportantNotice[];
}

function normalizeSeverity(value: unknown): NoticeSeverity {
    if (value === "warning" || value === "closure") return value;
    return "info";
}

// Map snake_case DB row → camelCase ImportantNotice
function rowToNotice(row: Record<string, unknown>): ImportantNotice {
    return {
        id: String(row.id),
        message: String(row.message),
        severity: normalizeSeverity(row.severity),
        pinned: Boolean(row.pinned),
        startAt: String(row.start_at),
        expiresAt: String(row.expires_at),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function severityRank(severity: NoticeSeverity) {
    if (severity === "closure") return 3;
    if (severity === "warning") return 2;
    return 1;
}

function isNoticeVisible(notice: ImportantNotice): boolean {
    const now = Date.now();
    const start = notice.startAt ? new Date(notice.startAt).getTime() : 0;
    const expires = notice.expiresAt ? new Date(notice.expiresAt).getTime() : Infinity;
    return start <= now && now < expires;
}

export const useNoticesStore = create<NoticesState>((set, get) => ({
    notices: [],
    editingNoticeId: null,

    hydrate: async () => {
        const { data, error } = await supabase
            .from("notices")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to load notices:", error.message);
            return;
        }

        set({ notices: (data ?? []).map(rowToNotice) });
    },

    addNotice: async ({ message, severity, pinned, startAt, expiresAt }) => {
        const { data, error } = await supabase
            .from("notices")
            .insert({
                message: message.trim(),
                severity,
                pinned,
                start_at: new Date(startAt).toISOString(),
                expires_at: new Date(expiresAt).toISOString(),
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        set((state) => ({ notices: [rowToNotice(data), ...state.notices] }));
    },

    updateNotice: async (id, { message, severity, pinned, startAt, expiresAt }) => {
        const { data, error } = await supabase
            .from("notices")
            .update({
                message: message.trim(),
                severity,
                pinned,
                start_at: new Date(startAt).toISOString(),
                expires_at: new Date(expiresAt).toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        set((state) => ({
            notices: state.notices.map((n) => (n.id === id ? rowToNotice(data) : n)),
            editingNoticeId: null,
        }));
    },

    removeNotice: async (id) => {
        const { error } = await supabase.from("notices").delete().eq("id", id);
        if (error) throw new Error(error.message);
        set((state) => ({ notices: state.notices.filter((n) => n.id !== id) }));
    },

    togglePinned: async (id) => {
        const notice = get().notices.find((n) => n.id === id);
        if (!notice) return;

        const { data, error } = await supabase
            .from("notices")
            .update({ pinned: !notice.pinned, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        set((state) => ({
            notices: state.notices.map((n) => (n.id === id ? rowToNotice(data) : n)),
        }));
    },

    setEditingNoticeId: (id) => set({ editingNoticeId: id }),

    clearInactiveNotices: async () => {
        const now = new Date().toISOString();
        const { error } = await supabase
            .from("notices")
            .delete()
            .lt("expires_at", now);

        if (error) throw new Error(error.message);

        set((state) => ({
            notices: state.notices.filter(
                (n) => new Date(n.expiresAt).getTime() > Date.now()
            ),
        }));
    },

    getVisibleNotices: () => {
        return [...get().notices]
            .filter(isNoticeVisible)
            .sort((a, b) => {
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                const severityDiff = severityRank(b.severity) - severityRank(a.severity);
                if (severityDiff !== 0) return severityDiff;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
    },
}));
