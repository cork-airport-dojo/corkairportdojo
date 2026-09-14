import { AppShell } from "~/components/layout/AppShell/AppShell";
import { WorkExperiencePage } from "~/components/workExperience/WorkExperiencePage";

export default function WorkExperienceRoute() {
    return (
        <AppShell>
            <WorkExperiencePage />
        </AppShell>
    );
}