export interface ResourceRecord {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
    active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateResourceRequest {
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    provider: "Google Drive" | "OneDrive" | "GitHub" | "External";
    href: string;
    active?: boolean;
}

export interface UpdateResourceRequest extends CreateResourceRequest {
    id: string;
}

async function handleResponse(response: Response) {
    const payload = (await response.json()) as
        | { resource?: ResourceRecord; message?: string }
        | { resources?: ResourceRecord[]; message?: string };

    if (!response.ok) {
        throw new Error(payload?.message || "Resource request failed.");
    }

    return payload;
}

export async function fetchResources(): Promise<ResourceRecord[]> {
    const response = await fetch("/api/resources", {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    const payload = (await handleResponse(response)) as { resources?: ResourceRecord[] };
    return payload.resources ?? [];
}

export async function createResourceRequest(input: CreateResourceRequest) {
    const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
    });

    const payload = (await handleResponse(response)) as { resource: ResourceRecord };
    return payload.resource;
}

export async function updateResourceRequest(input: UpdateResourceRequest) {
    const response = await fetch("/api/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
    });

    const payload = (await handleResponse(response)) as { resource: ResourceRecord };
    return payload.resource;
}

export async function deleteResourceRequest(id: string) {
    const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
    });

    await handleResponse(response);
}