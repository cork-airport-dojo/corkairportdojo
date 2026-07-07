import { modules as seedModules } from "~/lib/constants/modules";
import { materializeStoredModule } from "~/lib/modules";
import type { StoredModuleItem } from "~/lib/modules";

export function getAllModules(customModules: StoredModuleItem[] = []) {
    return [...seedModules, ...customModules.map(materializeStoredModule)];
}