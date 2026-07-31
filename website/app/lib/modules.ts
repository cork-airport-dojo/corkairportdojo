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
import { DynamicIcon } from 'lucide-react/dynamic'
import type { ModuleItem } from "~/lib/constants/modules";

// export const moduleIconMap = {
//     react: Atom,
//     node: Server,
//     typescript: Boxes,
//     database: Database,
//     nextjs: Globe,
//     security: ShieldCheck,
//     ai: BrainCircuit,
//     cloud: Cloud,
// } as const;

export interface StoredModuleItem {
    id: string;
    title: string;
    description: string;
    difficulty: ModuleItem["difficulty"];
    topic: string;
    iconKey: string;
    featured: boolean;
    overview: string[];
    createdAt: string;
    updatedAt: string;
}

export function materializeStoredModule(module: StoredModuleItem): ModuleItem {
    return {
        id: module.id,
        title: module.title,
        description: module.description,
        difficulty: module.difficulty,
        topic: module.topic,
        icon_key: module.iconKey,
        featured: module.featured,
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