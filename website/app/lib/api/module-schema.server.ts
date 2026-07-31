import { z } from "zod";

export const createModuleSchema = z.object({
    slug: z
        .string()
        .trim()
        .min(3)
        .max(120)
        .regex(/^[a-z0-9-]+$/),
    title: z.string().trim().min(3).max(180),
    description: z.string().trim().max(500).optional().default(""),
    topic: z.string().trim().max(120).optional().default(""),
    difficulty: z.string().trim().max(80).optional().default(""),
    featured: z.boolean().optional().default(false),
    published: z.boolean().optional().default(false),
    overview: z.array(z.string().trim()).optional().default([]),
});

export const updateModuleSchema = createModuleSchema.extend({
    id: z.string().uuid(),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;