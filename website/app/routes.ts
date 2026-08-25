import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("modules/new", "routes/modules.new.tsx"),
    route("modules", "routes/modules.tsx"),
    route("modules/:moduleId", "routes/modules.$moduleId.tsx"),
    route("modules/:slug/edit", "routes/modules.$slug.edit.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:postId", "routes/blog.$postId.tsx"),
    route("blog/:postId/edit", "routes/blog.$postId.edit.tsx"),
    route("write", "routes/write.tsx"),
    route("profile", "routes/profile.tsx"),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
    route("resources", "routes/resources.tsx"),
    route("auth/callback", "routes/auth.callback.tsx"),
    route("about", "routes/about.tsx")
] satisfies RouteConfig;