import { supabase } from "~/lib/supabase/browser";
import type { HeroButtonVariant, HeroCTAButton } from "~/store/use-hero-cta-store";

const TABLE = "hero_cta_buttons";

interface DbRow {
    id: string;
    label: string;
    href: string;
    variant: HeroButtonVariant;
    order: number;
    enabled: boolean;
    created_at: string;
}

function toButton(row: DbRow): HeroCTAButton {
    return {
        id: row.id,
        label: row.label,
        href: row.href,
        variant: row.variant,
        order: row.order,
        enabled: row.enabled,
    };
}

export async function fetchHeroCTAButtons(): Promise<HeroCTAButton[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("id, label, href, variant, order, enabled, created_at")
        .order("order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(toButton);
}

export async function insertHeroCTAButton(
    input: Omit<HeroCTAButton, "id">,
): Promise<HeroCTAButton> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert({
            label: input.label,
            href: input.href,
            variant: input.variant,
            order: input.order,
            enabled: input.enabled,
        })
        .select("id, label, href, variant, order, enabled, created_at")
        .single();

    if (error) throw new Error(error.message);
    return toButton(data);
}

export async function updateHeroCTAButton(
    id: string,
    input: Partial<Omit<HeroCTAButton, "id">>,
): Promise<HeroCTAButton> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(input)
        .eq("id", id)
        .select("id, label, href, variant, order, enabled, created_at")
        .single();

    if (error) throw new Error(error.message);
    return toButton(data);
}

export async function deleteHeroCTAButton(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(error.message);
}
