import { data } from "react-router";
import { getFeaturedModules } from "~/lib/api/modules.server";

export async function loader() {
    const modules = await getFeaturedModules();
    return data({ modules });
}