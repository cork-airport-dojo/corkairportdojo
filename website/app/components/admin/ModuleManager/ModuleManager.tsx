import { useEffect, useMemo, useState } from "react";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { moduleIconMap, type ModuleIconKey } from "~/lib/modules";
import { useCustomModulesStore } from "~/store/use-custom-modules-store";
import type { ModuleDifficulty } from "~/lib/constants/modules";
import styles from "./ModuleManager.module.scss";

const iconOptions = Object.keys(moduleIconMap) as ModuleIconKey[];

export function ModuleManager() {
    const { modules, hydrate, createModule, updateModule, removeModule } =
        useCustomModulesStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topic, setTopic] = useState("");
    const [lessons, setLessons] = useState("8");
    const [difficulty, setDifficulty] = useState<ModuleDifficulty>("Beginner");
    const [iconKey, setIconKey] = useState<ModuleIconKey>("react");
    const [featured, setFeatured] = useState(false);
    const [overviewText, setOverviewText] = useState("");

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const editingModule = useMemo(
        () => modules.find((module) => module.id === editingId) ?? null,
        [editingId, modules]
    );

    useEffect(() => {
        if (!editingModule) return;

        setTitle(editingModule.title);
        setDescription(editingModule.description);
        setTopic(editingModule.topic);
        setLessons(String(editingModule.lessons));
        setDifficulty(editingModule.difficulty);
        setIconKey(editingModule.iconKey);
        setFeatured(editingModule.featured);
        setOverviewText(editingModule.overview.join("\n\n"));
    }, [editingModule]);

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setTopic("");
        setLessons("8");
        setDifficulty("Beginner");
        setIconKey("react");
        setFeatured(false);
        setOverviewText("");
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            title,
            description,
            topic,
            lessons: Number(lessons),
            difficulty,
            iconKey,
            featured,
            overview: overviewText
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        };

        if (editingId) {
            updateModule(editingId, payload);
        } else {
            createModule(payload);
        }

        resetForm();
    };

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.titleRow}>
                    <div className={styles.iconWrap}>
                        <BookOpen size={16} />
                    </div>
                    <h2>Manage Modules</h2>
                </div>
            </CardHeader>

            <CardContent className={styles.body}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="module-title">Title</label>
                        <Input
                            id="module-title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Module title"
                        />
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
                                value={difficulty}
                                onChange={(event) =>
                                    setDifficulty(event.target.value as ModuleDifficulty)
                                }
                                className={styles.select}
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
                                value={iconKey}
                                onChange={(event) =>
                                    setIconKey(event.target.value as ModuleIconKey)
                                }
                                className={styles.select}
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
                        <span>Show as featured module on the home page</span>
                    </label>

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

                    <div className={styles.actions}>
                        <Button type="submit" className={styles.submitButton}>
                            {editingId ? "Save Module" : "Create Module"}
                        </Button>

                        {editingId && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </form>

                <div className={styles.moduleList}>
                    {modules.length === 0 ? (
                        <div className={styles.emptyState}>No custom modules created yet.</div>
                    ) : (
                        modules.map((module) => (
                            <div key={module.id} className={styles.moduleItem}>
                                <div className={styles.moduleText}>
                                    <div className={styles.moduleMetaRow}>
                                        <span className={styles.badge}>{module.difficulty}</span>
                                        {module.featured && (
                                            <span className={styles.badge}>Featured</span>
                                        )}
                                    </div>
                                    <strong>{module.title}</strong>
                                    <span>{module.topic}</span>
                                </div>

                                <div className={styles.moduleActions}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setEditingId(module.id)}
                                        aria-label="Edit module"
                                    >
                                        <Pencil size={16} />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeModule(module.id)}
                                        aria-label="Delete module"
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