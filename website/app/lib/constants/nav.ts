import {
    BookOpen,
    FolderKanban,
    Home,
    Layers3,
    PenSquare,
    FolderOpen,
    User
} from "lucide-react";

export const mobileNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/modules", label: "Modules", icon: Layers3 },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/resources", label: "Resources", icon: FolderOpen },
    { path: "/categories", label: "Categories", icon: FolderKanban },
    { path: "/profile", label: "Profile", icon: User },
    { to: "/write", label: "Write", icon: PenSquare }
];