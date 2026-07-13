import { getUserRole, type AppUserRole } from "~/lib/api/authz.server";

export async function canManageOwnedResource(
    userId: string,
    ownerId: string | null | undefined
) {
    const role = await getUserRole(userId);
    const isPrivileged = role === "admin" || role === "editor";
    const isOwner = ownerId != null && ownerId === userId;

    return {
        role,
        isPrivileged,
        isOwner,
        canManage: isPrivileged || isOwner,
    };
}

export async function requireOwnerOrPrivilegedRole(
    userId: string,
    ownerId: string | null | undefined
) {
    const permission = await canManageOwnedResource(userId, ownerId);

    if (!permission.canManage) {
        throw new Response(
            JSON.stringify({
                error: "Forbidden",
                message: "You do not have permission to modify this resource.",
            }),
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return permission;
}