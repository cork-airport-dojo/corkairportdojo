import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Layers3, Save, SendHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { ModuleDifficulty } from "~/lib/constants/modules";
import { supabase } from "~/lib/supabase/browser";
import styles from "./ModuleEditorPage.module.scss";
import { fetchModuleBySlug } from "~/lib/api/modules";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "~/components/ui/combobox";
import { Textarea } from "~/components/ui/textarea";

type ModuleStatus = "draft" | "published";

interface ModuleApiRecord {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  topic: string | null;
  icon_key: string | null;
  difficulty: ModuleDifficulty;
  featured: boolean;
  published: boolean;
  overview: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createModule(payload: {
  title: string;
  slug: string;
  description: string;
  topic: string;
  icon_key: string;
  difficulty: ModuleDifficulty;
  featured: boolean;
  published: boolean;
  overview: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("modules")
    .insert({ ...payload, created_by: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ModuleApiRecord;
}

async function updateModule(id: string, payload: {
  title: string;
  slug: string;
  description: string;
  topic: string;
  icon_key: string;
  difficulty: ModuleDifficulty;
  featured: boolean;
  published: boolean;
  overview: string;
}) {
  const { data, error } = await supabase
    .from("modules")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ModuleApiRecord;
}

const ICON_VISIBLE_LIMIT = 50;

export function ModuleEditorPage() {
  const navigate = useNavigate();
  const params = useParams();
  const moduleSlug = params.slug;
  const isEditMode = Boolean(moduleSlug);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [iconKey, setIconKey] = useState<string | IconName | null>("hammer");
  const [iconSearch, setIconSearch] = useState("");
  const [difficulty, setDifficulty] = useState<ModuleDifficulty | null>("Beginner");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<ModuleStatus>("draft");
  const [overviewText, setOverviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrating, setIsHydrating] = useState(isEditMode);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const filteredIconNames = useMemo(() => {
    const q = iconSearch.trim().toLowerCase();
    if (!q) return iconNames.slice(0, ICON_VISIBLE_LIMIT);
    const prefix = iconNames.filter((name) => name.startsWith(q));
    const rest = iconNames.filter((name) => !name.startsWith(q) && name.includes(q));
    return [...prefix, ...rest].slice(0, ICON_VISIBLE_LIMIT);
  }, [iconSearch]);

  useEffect(() => {
    if (!moduleSlug) return;

    let cancelled = false;

    const loadModule = async () => {
      try {
        setIsHydrating(true);
        setSubmitMessage(null);

        const module = await fetchModuleBySlug(moduleSlug);

        if (!module || cancelled) return;

        setId(module.id)
        setTitle(module.title);
        setSlug(module.slug);
        setDescription(module.description ?? "");
        setTopic(module.topic ?? "");
        setIconKey(module.icon_key ?? "");
        setDifficulty(module.difficulty as ModuleDifficulty);
        setFeatured(module.featured);
        setStatus(module.published ? "published" : "draft");
        setOverviewText((module.overview ?? []).join("\n\n"));
      } catch (error) {
        console.error("Failed to hydrate module editor:", error);

        if (!cancelled) {
          setSubmitMessage(
            error instanceof Error
              ? error.message
              : "Failed to load module."
          );
        }
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    };

    void loadModule();

    return () => {
      cancelled = true;
    };
  }, [moduleSlug]);

  const handleGenerateSlug = () => {
    setSlug(slugify(title));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    nextStatus: ModuleStatus
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const finalSlug = slug || slugify(title);

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        description: description.trim(),
        topic: topic.trim(),
        icon_key: iconKey?.trim() ?? "",
        difficulty: difficulty ?? "Beginner",
        featured,
        published: nextStatus === "published",
        overview: overviewText,
      };

      if (isEditMode && moduleSlug) {
        await updateModule(id, payload);
      } else {
        await createModule(payload);
      }

      navigate("/profile", {
        replace: true,
        state: {
          moduleSaved: true,
          moduleStatus: nextStatus,
          mode: isEditMode ? "edit" : "create",
        },
      });
    } catch (error) {
      console.error("Failed to submit module:", error);
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the module."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <Layers3 size={18} />
          </div>

          <div className={styles.headerText}>
            <span className={styles.eyebrow}>Module Editor</span>
            <h1>{isEditMode ? "Edit Module" : "Create New Module"}</h1>
            <p>
              {isEditMode
                ? "Update your module content, structure and publishing state."
                : "Create a structured learning module with draft and publish support."}
            </p>
          </div>
        </div>

        <div className={styles.headerStatus}>
          <span
            className={`${styles.statusPill} ${status === "published"
                ? styles.statusPublished
                : styles.statusDraft
              }`}
          >
            {status === "published" ? "Published" : "Draft"}
          </span>
        </div>
      </header>

      {isHydrating ? (
        <div className={styles.loadingState}>Loading module editor...</div>
      ) : (
        <form
          className={styles.layout}
          onSubmit={(event) => void handleSubmit(event, status)}
        >
          <div className={styles.mainColumn}>
            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <h2>Core Details</h2>
              </CardHeader>

              <CardContent className={styles.cardBody}>
                <div className={styles.field}>
                  <label htmlFor="module-title">Title</label>
                  <Input
                    id="module-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="React Fundamentals"
                  />
                </div>

                <div className={styles.slugRow}>
                  <div className={styles.field}>
                    <label htmlFor="module-slug">Slug</label>
                    <Input
                      id="module-slug"
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      placeholder="react-fundamentals"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className={styles.slugButton}
                    onClick={handleGenerateSlug}
                  >
                    Generate
                  </Button>
                </div>

                <div className={styles.field}>
                  <label htmlFor="module-description">Description</label>
                  <Textarea
                    id="module-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Short module description"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="module-icon-key">Icon Key <span className={styles.optional}>(optional)</span></label>

                  <Combobox autoHighlight value={iconKey} items={filteredIconNames} onValueChange={setIconKey} onInputValueChange={setIconSearch}>
                    <ComboboxTrigger render={
                      <Button variant="outline" className="justify-start w-64 font-normal">
                        <DynamicIcon name={iconKey as IconName} /> <ComboboxValue /></Button>
                    } />

                    <ComboboxContent className="bg-black max-h-[30dvh]">
                        <ComboboxInput showTrigger={false} placeholder="Search" />
                        <ComboboxEmpty>No items found.</ComboboxEmpty>

                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  <p className={styles.fieldHint}>
                    Find icon names at{" "}
                    <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer">
                      lucide.dev/icons
                    </a>
                  </p>
                </div>

                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label htmlFor="module-topic">Topic</label>
                    <Input
                      id="module-topic"
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      placeholder="React, TypeScript, AI..."
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="module-difficulty">Difficulty</label>
                    <select
                      id="module-difficulty"
                      className={styles.select}
                      value={difficulty}
                      onChange={(event) =>
                        setDifficulty(event.target.value as ModuleDifficulty)
                      }
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                  />
                  <span>Show this module as featured</span>
                </label>
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <h2>Overview Content</h2>
              </CardHeader>

              <CardContent className={styles.cardBody}>
                <div className={styles.field}>
                  <label htmlFor="module-overview">Overview Paragraphs</label>
                  <Textarea
                    id="module-overview"
                    className={styles.textarea}
                    value={overviewText}
                    onChange={(event) => setOverviewText(event.target.value)}
                    placeholder="Write one or more paragraphs. Separate paragraphs with a new line."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className={styles.sideColumn}>
            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <h2>Publishing</h2>
              </CardHeader>

              <CardContent className={styles.cardBody}>
                <div className={styles.field}>
                  <label htmlFor="module-status">Status</label>
                  <select
                    id="module-status"
                    className={styles.select}
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as ModuleStatus)
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className={styles.actionStack}>
                  <Button
                    type="button"
                    variant="outline"
                    className={styles.actionButton}
                    disabled={isSubmitting}
                    onClick={(event) => void handleSubmit(event, "draft")}
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? "Saving..." : "Save Draft"}</span>
                  </Button>

                  <Button
                    type="button"
                    className={styles.actionButton}
                    disabled={isSubmitting}
                    onClick={(event) => void handleSubmit(event, "published")}
                  >
                    <SendHorizontal size={16} />
                    <span>
                      {isSubmitting
                        ? "Publishing..."
                        : isEditMode
                          ? "Update & Publish"
                          : "Publish Module"}
                    </span>
                  </Button>
                </div>

                {submitMessage && (
                  <div className={styles.feedbackBox}>{submitMessage}</div>
                )}
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <h2>Preview Summary</h2>
              </CardHeader>

              <CardContent className={styles.cardBody}>
                <div className={styles.previewList}>
                  <div>
                    <span className={styles.previewLabel}>Title</span>
                    <strong>{title || "Untitled module"}</strong>
                  </div>

                  <div>
                    <span className={styles.previewLabel}>Slug</span>
                    <strong>{slug || slugify(title) || "module-slug"}</strong>
                  </div>

                  <div>
                    <span className={styles.previewLabel}>Topic</span>
                    <strong>{topic || "Not set"}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </form>
      )}
    </div>
  );
}