import {
    BookOpen,
    FolderKanban,
    Home,
    Layers3,
    PenSquare
} from "lucide-react";

export const mobileNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/modules", label: "Modules", icon: Layers3 },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/categories", label: "Categories", icon: FolderKanban },
    { to: "/write", label: "Write", icon: PenSquare }
];