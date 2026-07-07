import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("modules", "routes/modules.tsx"),
    route("modules/:moduleId", "routes/modules.$moduleId.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:postId", "routes/blog.$postId.tsx"),
    route("write", "routes/write.tsx"),
    route("profile", "routes/profile.tsx"),
    route("login", "routes/login.tsx"),
    route("resources", "routes/resources.tsx"),
] satisfies RouteConfig;