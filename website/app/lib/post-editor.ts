export interface PostEditorFormData {
    title: string;
    description: string;
    tags: string[];
    coverImage: string;
    content: string;
    markdownMode: boolean;
    status: "draft" | "review" | "published";
}

export const POST_EDITOR_STORAGE_KEY = "coderdojo-write-post-draft";

export function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function calculateWordCount(input: string) {
    if (input === null) return 0
    // const clean = stripHtml(input);
    const clean = input;
    return clean ? clean.split(" ").length : 0;
}

export function calculateReadingTime(words: number) {
    if (words === null) return 0
    
    return Math.max(1, Math.ceil(words / 200));
}

export function calculateSeoScore(data: PostEditorFormData) {
    let score = 0;

    if (data.title.trim().length >= 20) score += 20;
    if (data.description.trim().length >= 80) score += 20;
    if (data.tags.length >= 3) score += 30;
    if (data.coverImage.trim().length > 0) score += 10;
    if (calculateWordCount(data.content) >= 300) score += 20;

    return Math.min(score, 100);
}

export function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}