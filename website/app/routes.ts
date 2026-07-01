import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("modules", "routes/modules.tsx"),
    route("blog", "routes/blog.tsx"),
    route("write", "routes/write.tsx"),
    route("profile", "routes/profile.tsx"),
    route("login", "routes/login.tsx"),
] satisfies RouteConfig;