export function dataUrlToFile(dataUrl: string, filename = "upload.png") {
    const [meta, content] = dataUrl.split(",");

    if (!meta || !content) {
        throw new Error("Invalid data URL.");
    }

    const mimeMatch = meta.match(/data:(.*?);base64/);
    const mime = mimeMatch?.[1] || "application/octet-stream";

    const binary = atob(content);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return new File([bytes], filename, { type: mime });
}