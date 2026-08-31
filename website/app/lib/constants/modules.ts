import type { IconName } from "lucide-react/dynamic";

export type ModuleDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ModuleItem {
    id: string;
    title: string;
    slug?: string;
    description: string;
    difficulty: ModuleDifficulty;
    topic: string;
    icon_key?: IconName;
    featured: boolean;
    overview: string;
}

export const modules: ModuleItem[] = [
    {
        id: "react-fundamentals",
        title: "React Fundamentals",
        description: "Learn the core concepts of React from scratch.",
        difficulty: "Beginner",
        topic: "React",
        featured: true,
        overview: [
            "This module introduces the building blocks of React including JSX, props, state and component composition.",
            "Students will learn how to structure reusable components and reason about data flow across an interface.",
            "The goal is to give learners a strong foundation before moving into more advanced frontend architecture topics.",
        ],
    },
    {
        id: "nodejs-basics",
        title: "Node.js Basics",
        description: "Build scalable server-side applications with Node.js.",
        difficulty: "Beginner",
        topic: "Node.js",
        featured: false,
        overview: [
            "This module covers the fundamentals of Node.js, runtime concepts, modules and backend application structure.",
            "Students will understand how to build APIs and think about server-side workflows in JavaScript.",
            "It is designed as a practical foundation for modern backend development.",
        ],
    },
    {
        id: "typescript-essentials",
        title: "TypeScript Essentials",
        description: "Type-safe development for better code.",
        difficulty: "Intermediate",
        topic: "TypeScript",
        featured: true,
        overview: [
            "This module helps learners build confidence with static typing, reusable interfaces and maintainable application code.",
            "It focuses on practical developer workflows rather than only syntax memorization.",
            "By the end, students should be more comfortable introducing TypeScript into real projects.",
        ],
    },
    {
        id: "mongodb-guide",
        title: "MongoDB Guide",
        description: "Master MongoDB and database design.",
        difficulty: "Intermediate",
        topic: "Database",
        featured: false,
        overview: [
            "This module introduces MongoDB collections, documents, querying and practical schema planning.",
            "Students will learn how to think about document design and performance together.",
            "It is intended to give a practical working knowledge of MongoDB in application development.",
        ],
    },
    {
        id: "nextjs-mastery",
        title: "Next.js Mastery",
        description:
            "Build modern full-stack apps with routing, layouts and data fetching.",
        difficulty: "Advanced",
        topic: "Next.js",
        featured: true,
        overview: [
            "This module explores routing, layouts, rendering strategies and data fetching in modern Next.js applications.",
            "Learners will understand how to structure scalable app architecture using current framework patterns.",
            "It is especially useful for developers moving from basic React apps into full-stack product work.",
        ],
    },
    {
        id: "authentication-security",
        title: "Authentication & Security",
        description:
            "Understand auth flows, sessions, tokens and application security.",
        difficulty: "Advanced",
        topic: "Security",
        featured: true,
        overview: [
            "This module explains login flows, cookies, sessions, access control and common application security concerns.",
            "It helps developers understand both implementation and reasoning behind secure product design.",
            "The focus is practical and oriented toward real application architecture.",
        ],
    },
    {
        id: "ai-app-foundations",
        title: "AI App Foundations",
        description:
            "Integrate AI workflows, prompts and structured outputs into your apps.",
        difficulty: "Intermediate",
        topic: "AI",
        featured: false,
        overview: [
            "This module introduces core AI product concepts including prompt structure, input/output design and reliable UX patterns.",
            "Students will learn how to think about AI as a feature inside an application instead of as an isolated experiment.",
            "It is ideal for teams exploring practical AI product integration.",
        ],
    },
    {
        id: "cloud-deployment-basics",
        title: "Cloud Deployment Basics",
        description:
            "Deploy apps confidently with modern hosting and cloud workflows.",
        difficulty: "Beginner",
        topic: "Cloud",
        featured: false,
        overview: [
            "This module helps students understand the process of deploying applications and reasoning about hosting environments.",
            "It covers practical deployment concerns and operational confidence for developers shipping applications.",
            "The goal is to make release workflows less intimidating and more repeatable.",
        ],
    },
];