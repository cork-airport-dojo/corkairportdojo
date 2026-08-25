import { supabase } from "~/lib/supabase/browser";
import type { CreateArticleInput } from "./article-schema.server";

// Public reads (RLS: published = true)
export async function fetchPublishedArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*, resources:article_resources(resource:resources(*))")
    .eq("published", true);
  if (error) throw error;
  return data;
}

// Authenticated write (RLS enforces role + ownership)
export async function createArticle(payload: CreateArticleInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("articles")
    .insert({ ...payload, created_by: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Role lookup (RLS: user_id = auth.uid())
export async function fetchCurrentUserRole() {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .single();
  return data?.role ?? null;
}