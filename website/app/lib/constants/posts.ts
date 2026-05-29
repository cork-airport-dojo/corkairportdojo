export interface BlogPost {
    title: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
}

export const posts: BlogPost[] = [
    {
        title: "Understanding Next.js 14 App Router",
        category: "Next.js",
        excerpt:
            "A complete guide to layouts, nested routes, streaming and modern data fetching patterns in the App Router.",
        author: "Chris Murphy",
        date: "May 18, 2024",
        readTime: "8 min read",
        image:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
        featured: true,
    },
    {
        title: "TypeScript Tips for Better Development",
        category: "TypeScript",
        excerpt:
            "Practical TypeScript patterns that improve safety, readability and long-term maintainability.",
        author: "Chris Murphy",
        date: "May 15, 2024",
        readTime: "6 min read",
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
    {
        title: "Database Design Principles",
        category: "Database",
        excerpt:
            "Learn foundational database design concepts that help you model data cleanly and scale over time.",
        author: "Chris Murphy",
        date: "May 14, 2024",
        readTime: "10 min read",
        image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    },
    {
        title: "Building APIs with Node.js & Express",
        category: "Backend",
        excerpt:
            "A practical walkthrough for structuring routes, controllers, validation and error handling in Express.",
        author: "Chris Murphy",
        date: "May 10, 2024",
        readTime: "7 min read",
        image:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
    },
    {
        title: "Why React Architecture Matters",
        category: "React",
        excerpt:
            "How to think about composition, feature boundaries and scalable component design in React apps.",
        author: "Chris Murphy",
        date: "May 7, 2024",
        readTime: "9 min read",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    },
    {
        title: "Getting Started with Authentication",
        category: "Security",
        excerpt:
            "Sessions, JWTs, cookies and auth flows explained in a way that is practical for real projects.",
        author: "Chris Murphy",
        date: "May 3, 2024",
        readTime: "11 min read",
        image:
            "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
    },
];