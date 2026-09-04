import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, MousePointerClick, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
    useHeroCTAStore,
    type HeroButtonVariant,
} from "~/store/use-hero-cta-store";
import styles from "./HeroCTAButtonManager.module.scss";

export function HeroCTAButtonManager() {
    const {
        buttons,
        hydrate,
        addButton,
        updateButton,
        removeButton,
        toggleEnabled,
        moveButtonUp,
        moveButtonDown,
    } = useHeroCTAStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [label, setLabel] = useState("");
    const [href, setHref] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [variant, setVariant] = useState<HeroButtonVariant>("primary");
    const [order, setOrder] = useState("1");

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const editingButton = useMemo(() => {
        return buttons.find((button) => button.id === editingId) ?? null;
    }, [buttons, editingId]);

    useEffect(() => {
        if (!editingButton) return;

        setLabel(editingButton.label);
        setHref(editingButton.href);
        setEnabled(editingButton.enabled);
        setVariant(editingButton.variant);
        setOrder(String(editingButton.order));
    }, [editingButton]);

    const resetForm = () => {
        setEditingId(null);
        setLabel("");
        setHref("");
        setEnabled(true);
        setVariant("primary");
        setOrder(String(buttons.length + 1));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            label,
            href,
            enabled,
            variant,
            order: Number(order) || 1,
        };

        if (editingId) {
            updateButton(editingId, payload);
        } else {
            addButton(payload);
        }

        resetForm();
    };

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.titleRow}>
                    <div className={styles.iconWrap}>
                        <MousePointerClick size={16} />
                    </div>
                    <h2>Manage Hero Buttons</h2>
                </div>
            </CardHeader>

            <CardContent className={styles.body}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label htmlFor="hero-cta-label">Label</label>
                            <Input
                                id="hero-cta-label"
                                value={label}
                                onChange={(event) => setLabel(event.target.value)}
                                placeholder="Browse Modules"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="hero-cta-href">Link</label>
                            <Input
                                id="hero-cta-href"
                                value={href}
                                onChange={(event) => setHref(event.target.value)}
                                placeholder="/modules"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="hero-cta-variant">Style</label>
                            <select
                                id="hero-cta-variant"
                                value={variant}
                                onChange={(event) =>
                                    setVariant(event.target.value as HeroButtonVariant)
                                }
                                className={styles.select}
                            >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="outline">Outline</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="hero-cta-order">Order</label>
                            <Input
                                id="hero-cta-order"
                                type="number"
                                min="1"
                                value={order}
                                onChange={(event) => setOrder(event.target.value)}
                            />
                        </div>
                    </div>

                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(event) => setEnabled(event.target.checked)}
                        />
                        <span>Show this button on the home hero</span>
                    </label>

                    <div className={styles.actions}>
                        <Button type="submit" className={styles.submitButton}>
                            {editingId ? "Save Button" : "Add Button"}
                        </Button>

                        {editingId && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel Edit
                            </Button>
                        )}

                    </div>
                </form>

                <div className={styles.buttonList}>
                    {buttons.map((button) => (
                        <div key={button.id} className={styles.buttonItem}>
                            <div className={styles.buttonText}>
                                <div className={styles.metaRow}>
                                    <span className={styles.badge}>{button.variant}</span>
                                    <span className={styles.badge}>
                                        {button.enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </div>

                                <strong>{button.label}</strong>
                                <span>{button.href}</span>
                                <span>Order: {button.order}</span>
                            </div>

                            <div className={styles.buttonActions}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveButtonUp(button.id)}
                                    aria-label="Move button up"
                                >
                                    <ArrowUp size={16} />
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveButtonDown(button.id)}
                                    aria-label="Move button down"
                                >
                                    <ArrowDown size={16} />
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => toggleEnabled(button.id)}
                                    aria-label="Enable or disable button"
                                >
                                    {button.enabled ? "On" : "Off"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setEditingId(button.id)}
                                    aria-label="Edit button"
                                >
                                    <Pencil size={16} />
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeButton(button.id)}
                                    aria-label="Delete button"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}