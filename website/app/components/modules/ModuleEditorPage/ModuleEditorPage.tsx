import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Layers3, Save, SendHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { moduleIconMap, type ModuleIconKey } from "~/lib/modules";
import type { ModuleDifficulty } from "~/lib/constants/modules";
import styles from "./ModuleEditorPage.module.scss";

const iconOptions = Object.keys(moduleIconMap) as ModuleIconKey[];

type ModuleStatus = "draft" | "published";

interface ModuleApiRecord {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: ModuleDifficulty;
    lessons: number;
    icon_key: string | null;
    featured: boolean;
    published: boolean;
    overview: string[];
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
    lessons: number;
    difficulty: ModuleDifficulty;
    iconKey: ModuleIconKey;
    featured: boolean;
    published: boolean;
    overview: string[];
}) {
    const response = await fetch("/api/profile/modules", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as
        | { message?: string; module?: ModuleApiRecord }
        | null;

    if (!response.ok) {
        throw new Error(result?.message || "Failed to create module.");
    }

    return result?.module ?? null;
}

async function fetchModule(id: string) {
    const response = await fetch(`/api/profile/modules/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    const result = (await response.json().catch(() => null)) as
        | { message?: string; module?: ModuleApiRecord }
        | null;

    if (!response.ok) {
        throw new Error(result?.message || "Failed to load module.");
    }

    return result?.module ?? null;
}

async function updateModule(
    id: string,
    payload: {
        title: string;
        slug: string;
        description: string;
        topic: string;
        lessons: number;
        difficulty: ModuleDifficulty;
        iconKey: ModuleIconKey;
        featured: boolean;
        published: boolean;
        overview: string[];
    }
) {
    const response = await fetch(`/api/profile/modules/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as
        | { message?: string; module?: ModuleApiRecord }
        | null;

    if (!response.ok) {
        throw new Error(result?.message || "Failed to update module.");
    }

    return result?.module ?? null;
}

export function ModuleEditorPage() {
    const navigate = useNavigate();
    const params = useParams();
    const moduleId = params.id;
    const isEditMode = Boolean(moduleId);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [topic, setTopic] = useState("");
    const [lessons, setLessons] = useState("8");
    const [difficulty, setDifficulty] = useState<ModuleDifficulty>("Beginner");
    const [iconKey, setIconKey] = useState<ModuleIconKey>("react");
    const [featured, setFeatured] = useState(false);
    const [status, setStatus] = useState<ModuleStatus>("draft");
    const [overviewText, setOverviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHydrating, setIsHydrating] = useState(isEditMode);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const overviewParagraphs = useMemo(() => {
        return overviewText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
    }, [overviewText]);

    useEffect(() => {
        if (!moduleId) return;

        let cancelled = false;

        const loadModule = async () => {
            try {
                setIsHydrating(true);
                setSubmitMessage(null);

                const module = await fetchModule(moduleId);

                if (!module || cancelled) return;

                setTitle(module.title);
                setSlug(module.slug);
                setDescription(module.description ?? "");
                setTopic(module.topic ?? "");
                setLessons(String(module.lessons));
                setDifficulty(module.difficulty);
                setIconKey((module.icon_key as ModuleIconKey | null) ?? "react");
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
    }, [moduleId]);

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
                lessons: Number(lessons),
                difficulty,
                iconKey,
                featured,
                published: nextStatus === "published",
                overview: overviewParagraphs,
            };

            if (isEditMode && moduleId) {
                await updateModule(moduleId, payload);
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
                        className={`${styles.statusPill} ${
                            status === "published"
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
                                    <Input
                                        id="module-description"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="Short module description"
                                    />
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
                                        <label htmlFor="module-lessons">Lessons</label>
                                        <Input
                                            id="module-lessons"
                                            type="number"
                                            min="1"
                                            value={lessons}
                                            onChange={(event) => setLessons(event.target.value)}
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

                                    <div className={styles.field}>
                                        <label htmlFor="module-icon">Icon</label>
                                        <select
                                            id="module-icon"
                                            className={styles.select}
                                            value={iconKey}
                                            onChange={(event) =>
                                                setIconKey(event.target.value as ModuleIconKey)
                                            }
                                        >
                                            {iconOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
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
                                    <textarea
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

                                    <div>
                                        <span className={styles.previewLabel}>Lessons</span>
                                        <strong>{lessons || "0"}</strong>
                                    </div>

                                    <div>
                                        <span className={styles.previewLabel}>
                                            Overview paragraphs
                                        </span>
                                        <strong>{overviewParagraphs.length}</strong>
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