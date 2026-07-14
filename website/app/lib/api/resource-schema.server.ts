import { z } from "zod";

export const providerSchema = z.enum([
    "Google Drive",
    "OneDrive",
    "GitHub",
    "External",
]);

export const createResourceSchema = z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().min(2).max(500),
    category: z.string().trim().min(2).max(80),
    tags: z.array(z.string().trim().min(1).max(40)).default([]),
    image: z.string().trim().url(),
    provider: providerSchema,
    href: z.string().trim().url(),
    active: z.boolean().optional().default(true),
});

export const updateResourceSchema = createResourceSchema.extend({
    id: z.string().uuid(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;