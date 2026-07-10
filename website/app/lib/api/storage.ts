import { supabase } from "~/lib/supabase/browser";

function getFileExtension(file: File) {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "bin" : "bin";
}

export async function uploadArticleCoverImage(file: File, userId: string) {
    const extension = getFileExtension(file);
    const filePath = `article-covers/${userId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(filePath, file, {
            upsert: false,
            contentType: file.type,
        });

    if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload image.");
    }

    const { data } = supabase.storage.from("article-images").getPublicUrl(filePath);

    return {
        path: filePath,
        publicUrl: data.publicUrl,
    };
}