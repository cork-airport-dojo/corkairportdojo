import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "~/components/ui/sheet";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./MobileSidebar.module.scss";

interface MobileSidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function MobileSidebar({
                                  collapsed,
                                  onToggleCollapse,
                              }: MobileSidebarProps) {
    return (
        <div className={styles.mobileOnly}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={styles.menuButton}
                        aria-label="Open navigation"
                    >
                        <Menu size={18} />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className={styles.sheetContent}>
                    <Sidebar collapsed={false} onToggleCollapse={onToggleCollapse} />
                </SheetContent>
            </Sheet>
        </div>
    );
}