import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    FolderPlus,
    Grid2x2,
    Link2,
    Search,
    ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "~/store/use-auth-store";
import { useResourcesStore } from "~/store/use-resources-store";
import type { ResourceRecord } from "~/lib/api/resources";
import { ResourceCard } from "../ResourceCard/ResourceCard";
import { ResourceDialog } from "../ResourceDialog/ResourceDialog";
import { ResourceOverviewChart } from "../ResourceOverviewChart/ResourceOverviewChart";
import { DeleteResourceDialog } from "../DeleteResourceDialog/DeleteResourceDialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import styles from "./ResourcesPage.module.scss";

export function ResourcesPage() {
    const { canManageContent } = useAuthStore();
    const { resources, isLoading, error, hydrate, createResource, updateResource, deleteResource } =
        useResourcesStore();

    const [search, setSearch] = useState("");
    const [providerFilter, setProviderFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<ResourceRecord | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<ResourceRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const matchesSearch =
                !search.trim() ||
                resource.title.toLowerCase().includes(search.toLowerCase()) ||
                resource.description.toLowerCase().includes(search.toLowerCase()) ||
                resource.category.toLowerCase().includes(search.toLowerCase());

            const matchesProvider =
                providerFilter === "All Types" || resource.provider === providerFilter;

            const matchesStatus =
                statusFilter === "All Status" ||
                (statusFilter === "Active" && resource.active) ||
                (statusFilter === "Inactive" && !resource.active);

            return matchesSearch && matchesProvider && matchesStatus;
        });
    }, [resources, search, providerFilter, statusFilter]);

    const totalResources = resources.length;
    const activeResources = resources.filter((resource) => resource.active).length;
    const recentResourcesCount = resources.filter((resource) => {
        const created = new Date(resource.created_at).getTime();
        const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
        return created >= thirtyDaysAgo;
    }).length;

    const recentResources = resources.slice(0, 4);

    const handleCreate = async (input: {
        title: string;
        description: string;
        category: string;
        tags: string[];
        image: string;
        provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
        href: string;
        active: boolean;
        module: string | null;
    }) => {
        if (editingResource) {
            await updateResource({
                id: editingResource.id,
                ...input,
            });
            return;
        }

        await createResource(input);
    };

    const openCreateDialog = () => {
        setEditingResource(null);
        setDialogOpen(true);
    };

    const openEditDialog = (resource: ResourceRecord) => {
        setEditingResource(resource);
        setDialogOpen(true);
    };

    /*const handleDelete = async (resource: ResourceRecord) => {
        const confirmed = window.confirm(
            `Delete resource "${resource.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        await deleteResource(resource.id);
    };*/

    const openDeleteDialog = (resource: ResourceRecord) => {
        setResourceToDelete(resource);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!resourceToDelete) return;

        setIsDeleting(true);

        try {
            await deleteResource(resourceToDelete.id);
            setDeleteDialogOpen(false);
            setResourceToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.page}>
            <ResourceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleCreate}
                initialResource={editingResource}
            />

            <DeleteResourceDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                resource={resourceToDelete}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <div className={styles.layout}>
                <div className={styles.main}>
                    <section className={styles.hero}>
                        <div className={styles.heroCopy}>
                            <h1 className={styles.title}>Resources</h1>
                            <p className={styles.description}>
                                Access and manage all learning resources in one place.
                            </p>
                        </div>

                        {canManageContent && (
                            <div className={styles.heroActions}>
                                <Button className={styles.primaryAction} onClick={openCreateDialog}>
                                    <FolderPlus size={16} />
                                    <span>Add New Resource</span>
                                </Button>
                            </div>
                        )}
                    </section>

                    <section className={styles.statsGrid}>
                        <Card className={styles.statCard}>
                            <CardContent className={styles.statCardContent}>
                                <div className={`${styles.statIconWrap} ${styles.statPurple}`}>
                                    <FolderPlus size={20} />
                                </div>
                                <div>
                                    <span className={styles.statLabel}>Total Resources</span>
                                    <strong className={styles.statValue}>{totalResources}</strong>
                                    <p className={styles.statMeta}>All connected resources</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={styles.statCard}>
                            <CardContent className={styles.statCardContent}>
                                <div className={`${styles.statIconWrap} ${styles.statGreen}`}>
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <span className={styles.statLabel}>Active</span>
                                    <strong className={styles.statValue}>{activeResources}</strong>
                                    <p className={styles.statMeta}>Currently available</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={styles.statCard}>
                            <CardContent className={styles.statCardContent}>
                                <div className={`${styles.statIconWrap} ${styles.statAmber}`}>
                                    <Clock3 size={20} />
                                </div>
                                <div>
                                    <span className={styles.statLabel}>Recent</span>
                                    <strong className={styles.statValue}>{recentResourcesCount}</strong>
                                    <p className={styles.statMeta}>Added in last 30 days</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <Card className={styles.toolbarCard}>
                        <CardContent className={styles.toolbar}>
                            <div className={styles.searchWrap}>
                                <Search size={18} className={styles.searchIcon} />
                                <Input
                                    className={styles.searchInput}
                                    placeholder="Search resources..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>

                            <div className={styles.filters}>
                                <Button
                                    variant="outline"
                                    className={styles.filterButton}
                                    onClick={() => setProviderFilter("All Types")}
                                >
                                    {providerFilter}
                                </Button>
                                <Button
                                    variant="outline"
                                    className={styles.filterButton}
                                    onClick={() =>
                                        setStatusFilter((current) =>
                                            current === "All Status"
                                                ? "Active"
                                                : current === "Active"
                                                    ? "Inactive"
                                                    : "All Status"
                                        )
                                    }
                                >
                                    {statusFilter}
                                </Button>
                                <Button variant="outline" className={styles.filterButton}>
                                    Sort: Newest
                                </Button>
                                <Button variant="outline" size="icon" className={styles.viewToggle}>
                                    <Grid2x2 size={18} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <Card className={styles.footerCard}>
                            <CardContent className={styles.footerBar}>{error}</CardContent>
                        </Card>
                    )}

                    {isLoading ? (
                        <Card className={styles.footerCard}>
                            <CardContent className={styles.footerBar}>Loading resources...</CardContent>
                        </Card>
                    ) : (
                        <section className={styles.resourceGrid}>
                            {filteredResources.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    canManage={canManageContent}
                                    onEdit={() => openEditDialog(resource)}
                                    onDelete={() => openDeleteDialog(resource)}
                                />
                            ))}
                        </section>
                    )}

                    <Card className={styles.footerCard}>
                        <CardContent className={styles.footerBar}>
                            <span>
                                Showing 1 to {filteredResources.length} of {resources.length} resources
                            </span>

                            <div className={styles.pagination}>
                                <Button variant="outline" size="sm" className={styles.pageButton}>
                                    1
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <aside className={styles.rail}>
                    <Card className={styles.railCard}>
                        <CardHeader>
                            <CardTitle>Resource Overview</CardTitle>
                            <CardDescription>
                                Provider breakdown across all resources.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResourceOverviewChart resources={resources} />
                        </CardContent>
                    </Card>

                    {canManageContent && (
                        <Card className={styles.railCard}>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Manage and connect resources.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className={styles.quickActionList}>
                                <Button
                                    variant="ghost"
                                    className={styles.quickActionItem}
                                    onClick={openCreateDialog}
                                >
                                    <FolderPlus size={18} />
                                    <div>
                                        <strong>Add New Resource</strong>
                                        <span>Connect a new resource</span>
                                    </div>
                                </Button>

                                <Button variant="ghost" className={styles.quickActionItem}>
                                    <Link2 size={18} />
                                    <div>
                                        <strong>Resource Templates</strong>
                                        <span>Use pre-configured templates</span>
                                    </div>
                                </Button>

                                <Button variant="ghost" className={styles.quickActionItem}>
                                    <ShieldCheck size={18} />
                                    <div>
                                        <strong>Manage Permissions</strong>
                                        <span>Control access to resources</span>
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <Card className={styles.railCard}>
                        <CardHeader>
                            <CardTitle>Recent Resources</CardTitle>
                        </CardHeader>
                        <CardContent className={styles.recentList}>
                            {recentResources.map((item, index) => (
                                <div key={item.id}>
                                    <div className={styles.recentItem}>
                                        <div>
                                            <strong>{item.title}</strong>
                                            <span>
                                                Added{" "}
                                                {new Intl.DateTimeFormat("en-IE", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }).format(new Date(item.created_at))}
                                            </span>
                                        </div>

                                        <Badge variant="secondary" className={styles.activeBadge}>
                                            {item.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>

                                    {index < recentResources.length - 1 && (
                                        <Separator className={styles.recentSeparator} />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}