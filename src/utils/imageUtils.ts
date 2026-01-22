
/**
 * Transforms a Google Drive URL into a direct embeddable image URL.
 * Supports various Drive URL formats:
 * - https://drive.google.com/file/d/ID/view
 * - https://drive.google.com/open?id=ID
 * - https://drive.google.com/uc?id=ID
 * 
 * Returns the robust 'thumbnail' API format: https://drive.google.com/thumbnail?id=ID&sz=w1000
 */
export const transformGoogleDriveUrl = (url: string): string => {
    if (!url) return '';
    if (typeof url !== 'string') return '';

    try {
        // Already a correct thumbnail/lh3 link? Return as is (or maybe strict check?)
        if (url.includes('drive.google.com/thumbnail') || url.includes('lh3.googleusercontent.com')) {
            return url;
        }

        // Match ID
        // Patterns: /d/ID, id=ID
        const idMatch = url.match(/\/d\/([-a-zA-Z0-9_]+)/) || url.match(/id=([-a-zA-Z0-9_]+)/);

        if (idMatch && idMatch[1]) {
            const id = idMatch[1];
            // Use the thumbnail API with a large size (w1000) for good quality
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
        }
    } catch (e) {
        console.warn('Error transforming Drive URL:', e);
    }

    // Return original if no match (e.g. valid external URL from another host)
    return url;
};
