import {
    Atom,
    Boxes,
    BrainCircuit,
    Cloud,
    Database,
    Globe,
    Server,
    ShieldCheck,
} from "lucide-react";
import type { ModuleItem } from "~/lib/constants/modules";

export const moduleIconMap = {
    react: Atom,
    node: Server,
    typescript: Boxes,
    database: Database,
    nextjs: Globe,
    security: ShieldCheck,
    ai: BrainCircuit,
    cloud: Cloud,
} as const;

export type ModuleIconKey = keyof typeof moduleIconMap;

export interface StoredModuleItem {
    id: string;
    title: string;
    description: string;
    lessons: number;
    difficulty: ModuleItem["difficulty"];
    topic: string;
    iconKey: ModuleIconKey;
    featured: boolean;
    views: number;
    overview: string[];
    createdAt: string;
    updatedAt: string;
}

export function materializeStoredModule(module: StoredModuleItem): ModuleItem {
    return {
        id: module.id,
        title: module.title,
        description: module.description,
        lessons: module.lessons,
        difficulty: module.difficulty,
        topic: module.topic,
        icon: moduleIconMap[module.iconKey],
        featured: module.featured,
        views: module.views,
        overview: module.overview,
    };
}

export function slugifyModuleId(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}