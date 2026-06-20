/**
 * src/lib/cloudinaryUrl.js
 *
 * Helper to request a specific size from Cloudinary on the fly.
 * Works for ANY Cloudinary URL regardless of what transformation was
 * applied at upload time — Cloudinary generates the resized version
 * dynamically on first request and caches it at the CDN edge.
 *
 * Usage:
 *   import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
 *   <img src={getCloudinaryUrl(item.coverImage, 364, 248) || fallback} />
 */
export function getCloudinaryUrl(url, width, height) {
    if (!url || !url.includes('cloudinary.com')) return url ?? null;

    const transformation = `w_${width},h_${height},c_fill,g_auto,q_auto,f_auto`;

    // If a transformation segment already exists, replace it; otherwise insert one
    if (url.includes('/upload/')) {
        // Remove any existing transformation block (e.g. w_306,h_204,c_fill,.../)
        const cleaned = url.replace(/\/upload\/[^/]+\//, '/upload/');
        return cleaned.replace('/upload/', `/upload/${transformation}/`);
    }
    return url;
}
