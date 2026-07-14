import { z } from "zod";

export const createArticleSchema = z.object({
    slug: z
        .string()
        .trim()
        .min(3, "Slug must be at least 3 characters.")
        .max(120, "Slug must be 120 characters or fewer.")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and hyphens."),
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters.")
        .max(180, "Title must be 180 characters or fewer."),
    excerpt: z
        .string()
        .trim()
        .max(320, "Excerpt must be 320 characters or fewer.")
        .optional()
        .default(""),
    body: z
        .array(z.string().trim().min(1))
        .min(1, "Article body must contain at least one paragraph."),
    category: z
        .string()
        .trim()
        .max(80, "Category must be 80 characters or fewer.")
        .optional()
        .default("General"),
    author_name: z
        .string()
        .trim()
        .max(120, "Author name must be 120 characters or fewer.")
        .optional()
        .default(""),
    author_avatar_url: z
        .string()
        .trim()
        .refine(
            (value) =>
                value === "" ||
                value.startsWith("http://") ||
                value.startsWith("https://"),
            "Author avatar URL must be an http or https URL."
        )
        .optional()
        .default(""),
    cover_image: z
        .string()
        .trim()
        .refine(
            (value) =>
                value === "" ||
                (value.startsWith("http://") || value.startsWith("https://")),
            "Cover image must be an http or https URL."
        )
        .optional()
        .default(""),
    read_time: z
        .string()
        .trim()
        .max(40, "Read time must be 40 characters or fewer.")
        .optional()
        .default(""),
    featured: z.boolean().optional().default(false),
    published: z.boolean().optional().default(false),
});

export const updateArticleSchema = createArticleSchema.extend({
    id: z.string().uuid("Article id must be a valid UUID."),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;