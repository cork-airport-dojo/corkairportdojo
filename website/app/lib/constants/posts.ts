export interface BlogPost {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
    resourceIds?: string[];
    body: string[];
}

export const posts: BlogPost[] = [
    {
        id: "understanding-nextjs-14-app-router",
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
        resourceIds: ["nextjs-router-cheatsheet"],
        body: [
            "The App Router changes how we think about structure in Next.js applications. Instead of treating routing as a thin wrapper around pages, layouts and nested UI become first-class parts of the application architecture.",
            "One of the biggest advantages is layout composition. Shared layouts allow you to define persistent UI boundaries once and keep them stable while nested routes change underneath. That improves both the developer experience and the user experience.",
            "Streaming and server components also change how data-heavy pages can be built. Instead of waiting for everything to complete before rendering, the framework can progressively reveal content while preserving a clear route structure.",
            "The most important habit is to think in route segments and UI boundaries rather than one giant page tree. That mindset helps you build apps that are easier to scale, maintain and reason about over time.",
        ],
    },
    {
        id: "typescript-tips-for-better-development",
        title: "TypeScript Tips for Better Development",
        category: "TypeScript",
        excerpt:
            "Practical TypeScript patterns that improve safety, readability and long-term maintainability.",
        author: "Chris Murphy",
        date: "May 15, 2024",
        readTime: "6 min read",
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        resourceIds: ["typescript-utility-types-pack"],
        body: [
            "TypeScript is most valuable when it improves communication between developers, not just when it satisfies the compiler. Clear types reduce ambiguity and make refactoring safer.",
            "A good place to start is with reusable interfaces and utility types. These can remove duplication while making relationships between data structures more explicit.",
            "Another practical improvement is being stricter at application boundaries. Typed API responses, typed component props and well-defined state shapes help prevent classes of bugs before they appear in production.",
            "The end goal is not maximum complexity in type definitions. The goal is confidence, maintainability and a codebase that remains understandable as it grows.",
        ],
    },
    {
        id: "database-design-principles",
        title: "Database Design Principles",
        category: "Database",
        excerpt:
            "Learn foundational database design concepts that help you model data cleanly and scale over time.",
        author: "Chris Murphy",
        date: "May 14, 2024",
        readTime: "10 min read",
        image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        resourceIds: ["database-schema-checklist"],
        body: [
            "Database design starts with clarity. Before writing queries or choosing indexes, you need to understand the entities in your system and the relationships between them.",
            "Strong schema design usually comes from balancing normalization with real application needs. Too much duplication creates consistency problems, but over-normalization can also make common queries harder than they need to be.",
            "Indexes should reflect real access patterns rather than abstract ideas of optimization. Understanding how the application reads and writes data is essential.",
            "The best database models are not only correct today but resilient to change tomorrow. That usually means naming clearly, modeling relationships explicitly and documenting important trade-offs.",
        ],
    },
    {
        id: "building-apis-with-nodejs-express",
        title: "Building APIs with Node.js & Express",
        category: "Backend",
        excerpt:
            "A practical walkthrough for structuring routes, controllers, validation and error handling in Express.",
        author: "Chris Murphy",
        date: "May 10, 2024",
        readTime: "7 min read",
        image:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
        resourceIds: [],
        body: [
            "A clean API structure is about separation of concerns. Routes should define entry points, controllers should coordinate request flow, and services should contain business logic.",
            "Validation should happen at the boundary. That keeps malformed input from leaking deeper into the application and makes error handling much more predictable.",
            "Error responses also benefit from consistency. Clients should not need to guess what shape an error will take depending on which endpoint they called.",
            "When Express apps grow, the code that survives is usually code that was organized around responsibilities instead of convenience.",
        ],
    },
    {
        id: "why-react-architecture-matters",
        title: "Why React Architecture Matters",
        category: "React",
        excerpt:
            "How to think about composition, feature boundaries and scalable component design in React apps.",
        author: "Chris Murphy",
        date: "May 7, 2024",
        readTime: "9 min read",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        resourceIds: ["react-architecture-notes"],
        body: [
            "React applications become easier to maintain when component boundaries reflect feature boundaries. That means grouping concerns around user-facing capabilities, not just around file types.",
            "Composition is stronger than duplication. Reusable layout patterns, clear data ownership and well-defined shared components help reduce accidental complexity.",
            "Architecture matters because teams need predictable structure. Without it, every new feature becomes slower to build and harder to review.",
            "The most effective React codebases are rarely the most clever. They are the ones that make common decisions obvious and repeatable.",
        ],
    },
    {
        id: "getting-started-with-authentication",
        title: "Getting Started with Authentication",
        category: "Security",
        excerpt:
            "Sessions, JWTs, cookies and auth flows explained in a way that is practical for real projects.",
        author: "Chris Murphy",
        date: "May 3, 2024",
        readTime: "11 min read",
        image:
            "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
        resourceIds: ["auth-security-flow-diagram"],
        body: [
            "Authentication is easier to understand when you separate identity, session management and authorization. These are related but not interchangeable concepts.",
            "Many teams struggle because they jump too quickly into token implementation details without first mapping the actual user journey through login, refresh and logout flows.",
            "Cookies, sessions and JWTs each have strengths depending on the application architecture. The correct choice depends on deployment model, threat assumptions and developer workflow.",
            "A strong authentication implementation is not defined only by signing users in. It is defined by how safely and predictably the system behaves across the entire lifecycle.",
        ],
    },
];