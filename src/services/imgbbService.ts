/**
 * ImgBB Image Upload Service
 * 
 * Provides free, unlimited image hosting as a complement to Firebase.
 * Firebase handles: Authentication + Firestore Database
 * ImgBB handles: Image storage
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBUploadResponse {
    data: {
        url: string;
        display_url: string;
        delete_url: string;
    };
    success: boolean;
}

/**
 * Uploads an image file to ImgBB
 * @param file - The image file to upload
 * @returns Promise with the hosted image URL
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
    if (!IMGBB_API_KEY) {
        throw new Error('ImgBB API key is not configured. Please add VITE_IMGBB_API_KEY to your .env.local file.');
    }

    // Create FormData for the upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    try {
        const response = await fetch(IMGBB_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to upload image to ImgBB');
        }

        const data: ImgBBUploadResponse = await response.json();

        if (!data.success || !data.data?.url) {
            throw new Error('ImgBB upload succeeded but no URL was returned');
        }

        // Return the direct image URL
        return data.data.url;
    } catch (error) {
        console.error('ImgBB upload error:', error);
        throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Uploads multiple images to ImgBB
 * @param files - Array of image files to upload
 * @returns Promise with array of hosted image URLs
 */
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => uploadImageToImgBB(file));
    return Promise.all(uploadPromises);
}
