import { ExternalLink, Files, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import type { ResourceRecord } from "~/lib/api/resources";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import styles from "./ResourceCard.module.scss";

interface ResourceCardProps {
    resource: ResourceRecord;
    canManage?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function ResourceCard({
                                 resource,
                                 canManage = false,
                                 onEdit,
                                 onDelete,
                             }: ResourceCardProps) {
    return (
        <Card className={styles.card}>
            <CardContent className={styles.content}>
                <div className={styles.headerRow}>
                    <div className={styles.logoWrap}>
                        <img
                            src={resource.image}
                            alt={resource.title}
                            className={styles.logo}
                            onError={(event) => {
                                event.currentTarget.src = "/logo.png";
                            }}
                        />
                    </div>

                    <div className={styles.headerMeta}>
                        <h3 className={styles.title}>{resource.title}</h3>
                        <Badge
                            variant="secondary"
                            className={resource.active ? styles.status : styles.inactiveStatus}
                        >
                            {resource.active ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    {canManage && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={styles.menuButton}
                                    aria-label="More actions"
                                >
                                    <MoreVertical size={16} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>
                                    <Pencil size={14} />
                                    <span>Edit Resource</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete}>
                                    <Trash2 size={14} />
                                    <span>Delete Resource</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <p className={styles.description}>{resource.description}</p>

                <div className={styles.usageMeta}>
                    <span>0 B used</span>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar} />
                    </div>
                </div>

                <div className={styles.footerRow}>
                    <div className={styles.metaItem}>
                        <Users size={14} />
                        <span>0</span>
                    </div>

                    <div className={styles.metaItem}>
                        <Files size={14} />
                        <span>{resource.provider}</span>
                    </div>

                    <Button asChild variant="outline" size="sm" className={styles.link}>
                        <a href={resource.href} target="_blank" rel="noreferrer">
                            <span>Open</span>
                            <ExternalLink size={14} />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}