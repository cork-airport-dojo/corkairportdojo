export function validateCoverImageFile(file: File, maxSizeMb = 5) {
    const maxBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxBytes) {
        throw new Error(`Image is too large. Maximum allowed size is ${maxSizeMb}MB.`);
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed.");
    }
}