import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Search } from "lucide-react";

import styles from "./Spotlight.module.scss";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { publicNavItems, privateNavItems, contentQuickActions, type NavItem } from "../layout/Sidebar/Sidebar";
import { Button } from "../ui/button";
import { Kbd, KbdGroup } from "../ui/kbd";
import { useDebounce } from "~/hooks/use-debounce";
import { useSpotlightSearch } from "~/hooks/use-spotlight-search";
import { useAuthStore } from "~/store/use-auth-store";

function getKbdItems(): string[] | null {
  const ua = navigator.userAgent;
  if (ua.includes("Macintosh")) return ["⌘", "k"];
  if (ua.includes("Android") || ua.includes("iPhone") || ua.includes("iPad")) return null;
  return ["Ctrl", "k"];
}

const kbdItems = getKbdItems();

export function Spotlight() {
  const navigate = useNavigate();
  const { isAuthenticated, canManageContent } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchResults = useSpotlightSearch(debouncedQuery);

  const baseNavItems = useMemo<NavItem[]>(() => [
    ...publicNavItems,
    // allow to get to profile page
    ...(isAuthenticated ? privateNavItems : []),
    // allow to get to content management pages
    ...(canManageContent ? contentQuickActions : []),
  ], [isAuthenticated, canManageContent]);

  const filteredResults = useMemo<NavItem[]>(() => {
    if (debouncedQuery.length === 0) return baseNavItems;
    const q = debouncedQuery.toLowerCase();
    return searchResults.concat(
      baseNavItems.filter((opt) => opt.label.toLowerCase().includes(q))
    );
  }, [debouncedQuery, searchResults, baseNavItems]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={styles.trigger}>
        <Button variant="ghost" className={styles.btn}>
          <div className={styles.leftSection}>
            <Search size={18} className={styles.searchIcon} />
            <span>Search</span>
          </div>

          {kbdItems !== null && (
            <KbdGroup>
              <Kbd>{kbdItems[0]}</Kbd>
              <span>+</span>
              <Kbd>{kbdItems[1]}</Kbd>
            </KbdGroup>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for pages, articles, and modules.</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Search for modules, articles, and pages."
            className={styles.searchInput}
            aria-label="Search articles, modules, topics"
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {filteredResults.map((opt) => {
                const Icon = opt.icon;
                return (
                  <CommandItem
                    key={opt.to ?? String(opt.label)}
                    value={String(opt.label)}
                    onSelect={() => handleSelect(opt.to || "/")}
                  >
                    {Icon && <Icon size={14} />}
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
