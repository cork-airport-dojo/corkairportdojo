import { useEffect, useMemo, useState } from "react";
import { Megaphone, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
    useNoticesStore,
    type NoticeSeverity,
    type ImportantNotice,
} from "~/store/use-notices-store";
import styles from "./NoticeManager.module.scss";

function safeFormatDateTime(value: string) {
    const date = new Date(value);
    const time = date.getTime();

    if (!Number.isFinite(time)) return "Invalid date";

    return new Intl.DateTimeFormat("en-IE", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function toDatetimeLocalValue(value: string) {
    const date = new Date(value);
    const pad = (num: number) => String(num).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDefaultStartDate() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

function getDefaultExpiryDate() {
    const later = new Date(Date.now() + 1000 * 60 * 60 * 24);
    later.setMinutes(later.getMinutes() - later.getTimezoneOffset());
    return later.toISOString().slice(0, 16);
}

export function NoticeManager() {
    const {
        notices,
        editingNoticeId,
        hydrate,
        addNotice,
        updateNotice,
        removeNotice,
        togglePinned,
        setEditingNoticeId,
        clearInactiveNotices,
    } = useNoticesStore();

    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<NoticeSeverity>("info");
    const [pinned, setPinned] = useState(false);
    const [startAt, setStartAt] = useState(getDefaultStartDate());
    const [expiresAt, setExpiresAt] = useState(getDefaultExpiryDate());

    useEffect(() => {
        hydrate();
        clearInactiveNotices();
    }, [hydrate, clearInactiveNotices]);

    const sortedNotices = useMemo(() => {
        return [...notices].sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [notices]);

    const editingNotice = useMemo<ImportantNotice | null>(() => {
        return notices.find((notice) => notice.id === editingNoticeId) ?? null;
    }, [editingNoticeId, notices]);

    useEffect(() => {
        if (!editingNotice) return;

        setMessage(editingNotice.message);
        setSeverity(editingNotice.severity);
        setPinned(editingNotice.pinned);
        setStartAt(toDatetimeLocalValue(editingNotice.startAt));
        setExpiresAt(toDatetimeLocalValue(editingNotice.expiresAt));
    }, [editingNotice]);

    const resetForm = () => {
        setMessage("");
        setSeverity("info");
        setPinned(false);
        setStartAt(getDefaultStartDate());
        setExpiresAt(getDefaultExpiryDate());
        setEditingNoticeId(null);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!message.trim() || !startAt || !expiresAt) return;

        if (editingNoticeId) {
            updateNotice(editingNoticeId, {
                message,
                severity,
                pinned,
                startAt,
                expiresAt,
            });
        } else {
            addNotice({
                message,
                severity,
                pinned,
                startAt,
                expiresAt,
            });
        }

        resetForm();
    };

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.titleRow}>
                    <div className={styles.iconWrap}>
                        <Megaphone size={16} />
                    </div>
                    <h2>Manage Important Notices</h2>
                </div>
            </CardHeader>

            <CardContent className={styles.body}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="notice-message">Notice</label>
                        <Input
                            id="notice-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Enter a notice for students"
                        />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label htmlFor="notice-severity">Severity</label>
                            <select
                                id="notice-severity"
                                value={severity}
                                onChange={(event) =>
                                    setSeverity(event.target.value as NoticeSeverity)
                                }
                                className={styles.select}
                            >
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="closure">Closure</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="notice-start">Start Date</label>
                            <Input
                                id="notice-start"
                                type="datetime-local"
                                value={startAt}
                                onChange={(event) => setStartAt(event.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="notice-expiry">Expiry</label>
                            <Input
                                id="notice-expiry"
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(event) => setExpiresAt(event.target.value)}
                            />
                        </div>
                    </div>

                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={pinned}
                            onChange={(event) => setPinned(event.target.checked)}
                        />
                        <span>Pin this notice to the top</span>
                    </label>

                    <div className={styles.actions}>
                        <Button type="submit" className={styles.submitButton}>
                            {editingNoticeId ? "Save Notice" : "Add Notice"}
                        </Button>

                        {editingNoticeId && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </form>

                <div className={styles.noticeList}>
                    {sortedNotices.length === 0 ? (
                        <div className={styles.emptyState}>No notices created yet.</div>
                    ) : (
                        sortedNotices.map((notice) => (
                            <div key={notice.id} className={styles.noticeItem}>
                                <div className={styles.noticeText}>
                                    <div className={styles.noticeMetaRow}>
                                        <span
                                            className={`${styles.severityBadge} ${
                                                styles[`severity-${notice.severity}`]
                                            }`}
                                        >
                                            {notice.severity}
                                        </span>

                                        {notice.pinned && (
                                            <span className={styles.pinnedBadge}>Pinned</span>
                                        )}
                                    </div>

                                    <strong>{notice.message}</strong>

                                    <span>
                                        Start:{" "}
                                        {safeFormatDateTime(notice.startAt)}
                                    </span>

                                    <span>
                                        Expires:{" "}
                                        {safeFormatDateTime(notice.expiresAt)}
                                    </span>
                                </div>

                                <div className={styles.noticeActions}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className={styles.actionButton}
                                        onClick={() => togglePinned(notice.id)}
                                        aria-label={notice.pinned ? "Unpin notice" : "Pin notice"}
                                    >
                                        {notice.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className={styles.actionButton}
                                        onClick={() => setEditingNoticeId(notice.id)}
                                        aria-label="Edit notice"
                                    >
                                        <Pencil size={16} />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className={styles.actionButton}
                                        onClick={() => removeNotice(notice.id)}
                                        aria-label="Remove notice"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}