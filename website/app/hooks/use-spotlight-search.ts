import { useEffect, useState } from "react";
import { BookOpen, Layers3 } from "lucide-react";
import { supabase } from "~/lib/supabase/browser";
import { type NavItem } from "~/components/layout/Sidebar/Sidebar";

export function useSpotlightSearch(query: string): NavItem[] {
  const [results, setResults] = useState<NavItem[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const q = `%${query}%`;

    Promise.all([
      supabase
        .from("modules")
        .select("slug, title")
        .eq("published", true)
        .or(`title.ilike.${q},description.ilike.${q},topic.ilike.${q}`)
        .limit(5),
      supabase
        .from("articles")
        .select("slug, title")
        .eq("published", true)
        .or(`title.ilike.${q},excerpt.ilike.${q}`)
        .limit(5),
    ]).then(([modulesRes, articlesRes]) => {
      const moduleItems: NavItem[] = (modulesRes.data ?? []).map((m) => ({
        label: m.title,
        to: `/modules/${m.slug}`,
        icon: Layers3,
      }));
      const articleItems: NavItem[] = (articlesRes.data ?? []).map((a) => ({
        label: a.title,
        to: `/blog/${a.slug}`,
        icon: BookOpen,
      }));
      setResults([...moduleItems, ...articleItems]);
    });
  }, [query]);

  return results;
}
