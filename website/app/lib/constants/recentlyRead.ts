export interface RecentlyReadItem {
    title: string;
    category: string;
    readAt: string;
}

export const recentlyRead: RecentlyReadItem[] = [
    {
        title: "Understanding Next.js 14 App Router",
        category: "Next.js",
        readAt: "Today",
    },
    {
        title: "TypeScript Tips for Better Development",
        category: "TypeScript",
        readAt: "Yesterday",
    },
    {
        title: "Database Design Principles",
        category: "Database",
        readAt: "2 days ago",
    },
    {
        title: "Building APIs with Node.js & Express",
        category: "Backend",
        readAt: "3 days ago",
    },
    {
        title: "Why React Architecture Matters",
        category: "React",
        readAt: "Last week",
    },
];