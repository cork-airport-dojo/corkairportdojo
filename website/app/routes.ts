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
    route("logout", "routes/logout.tsx"),
    route("resources", "routes/resources.tsx"),
    route("api/articles", "routes/api.articles.ts"),
    route("api/modules/featured", "routes/api.modules.featured.ts"),
    route("api/modules", "routes/api.modules.ts"),
    route("api/weather", "routes/api.weather.ts"),
    route("api/articles/:slug", "routes/api.articles.$slug.ts"),
    route("auth/callback", "routes/auth.callback.tsx"),
    route("api/me", "routes/api.me.ts"),
] satisfies RouteConfig;