export interface ResourceItem {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
}

export const resources: ResourceItem[] = [
    {
        id: "nextjs-router-cheatsheet",
        title: "Next.js App Router Cheatsheet",
        description: "A practical quick-reference guide for layouts, nested routes and rendering patterns.",
        category: "Next.js",
        tags: ["Next.js", "Routing", "Reference"],
        image: "https://picsum.photos/seed/resource-nextjs-router/1200/700",
        provider: "Google Drive",
        href: "https://drive.google.com/",
    },
    {
        id: "typescript-utility-types-pack",
        title: "TypeScript Utility Types Pack",
        description: "A downloadable collection of utility type examples for safer day-to-day development.",
        category: "TypeScript",
        tags: ["TypeScript", "Utilities", "Reference"],
        image: "https://picsum.photos/seed/resource-ts-utility/1200/700",
        provider: "OneDrive",
        href: "https://onedrive.live.com/",
    },
    {
        id: "database-schema-checklist",
        title: "Database Schema Checklist",
        description: "A reusable checklist for validating schema structure, indexing and relationship design.",
        category: "Database",
        tags: ["Database", "Checklist", "Architecture"],
        image: "https://picsum.photos/seed/resource-db-schema/1200/700",
        provider: "External",
        href: "https://example.com/database-schema-checklist",
    },
    {
        id: "react-architecture-notes",
        title: "React Architecture Notes",
        description: "A set of notes and diagrams explaining feature boundaries, composition and shared state patterns.",
        category: "React",
        tags: ["React", "Architecture", "Patterns"],
        image: "https://picsum.photos/seed/resource-react-architecture/1200/700",
        provider: "GitHub",
        href: "https://github.com/",
    },
    {
        id: "auth-security-flow-diagram",
        title: "Authentication Flow Diagram",
        description: "Visual reference material for auth flows, sessions, cookies and token handling.",
        category: "Security",
        tags: ["Security", "Auth", "Diagram"],
        image: "https://picsum.photos/seed/resource-auth-flow/1200/700",
        provider: "Google Drive",
        href: "https://drive.google.com/",
    },
];