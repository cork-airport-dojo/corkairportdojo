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

export type ModuleDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ModuleItem {
    title: string;
    description: string;
    lessons: number;
    difficulty: ModuleDifficulty;
    topic: string;
    icon: typeof Atom;
}

export const modules: ModuleItem[] = [
    {
        title: "React Fundamentals",
        description: "Learn the core concepts of React from scratch.",
        lessons: 12,
        difficulty: "Beginner",
        topic: "React",
        icon: Atom,
    },
    {
        title: "Node.js Basics",
        description: "Build scalable server-side applications with Node.js.",
        lessons: 10,
        difficulty: "Beginner",
        topic: "Node.js",
        icon: Server,
    },
    {
        title: "TypeScript Essentials",
        description: "Type-safe development for better code.",
        lessons: 15,
        difficulty: "Intermediate",
        topic: "TypeScript",
        icon: Boxes,
    },
    {
        title: "MongoDB Guide",
        description: "Master MongoDB and database design.",
        lessons: 8,
        difficulty: "Intermediate",
        topic: "Database",
        icon: Database,
    },
    {
        title: "Next.js Mastery",
        description:
            "Build modern full-stack apps with routing, layouts and data fetching.",
        lessons: 14,
        difficulty: "Advanced",
        topic: "Next.js",
        icon: Globe,
    },
    {
        title: "Authentication & Security",
        description:
            "Understand auth flows, sessions, tokens and application security.",
        lessons: 11,
        difficulty: "Advanced",
        topic: "Security",
        icon: ShieldCheck,
    },
    {
        title: "AI App Foundations",
        description:
            "Integrate AI workflows, prompts and structured outputs into your apps.",
        lessons: 9,
        difficulty: "Intermediate",
        topic: "AI",
        icon: BrainCircuit,
    },
    {
        title: "Cloud Deployment Basics",
        description:
            "Deploy apps confidently with modern hosting and cloud workflows.",
        lessons: 7,
        difficulty: "Beginner",
        topic: "Cloud",
        icon: Cloud,
    },
];