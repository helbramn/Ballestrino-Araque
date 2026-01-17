import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase.config';
import type { Property } from '../types/property';

const PROPERTIES_COLLECTION = 'properties';

// Get all properties
export const getProperties = async (): Promise<Property[]> => {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const snapshot = await getDocs(propertiesRef);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Safely convert timestamps if they exist
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
        } as unknown as Property;
    });
};

// Get highlighted properties only
export const getHighlightedProperties = async (): Promise<Property[]> => {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const q = query(propertiesRef, where('highlighted', '==', true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Property[];
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);
    const snapshot = await getDoc(propertyRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Property;
};

// Create new property
export const createProperty = async (propertyData: Omit<Property, 'id'>): Promise<string> => {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const docRef = await addDoc(propertiesRef, {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
};

// Update property
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);
    await updateDoc(propertyRef, {
        ...propertyData,
        updatedAt: serverTimestamp()
    });
};

// Delete property
export const deleteProperty = async (id: string): Promise<void> => {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);

    // Get property to delete its images
    const property = await getPropertyById(id);
    if (property && property.images) {
        // Delete images from storage
        // Delete images from storage (best effort)
        try {
            const deletePromises = property.images.filter(url => url.startsWith('http')).map(async (imageUrl) => {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (error) {
                    console.error('Error deleting image:', imageUrl, error);
                }
            });
            await Promise.all(deletePromises);
        } catch (imgError) {
            console.error('Error processing image deletions:', imgError);
            // Continue to delete document even if images fail
        }
    }

    // Delete document
    await deleteDoc(propertyRef);
};

// Upload property images to Firebase Storage
export const uploadPropertyImages = async (files: File[], propertyId: string): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
        const timestamp = Date.now();
        const fileName = `${propertyId}_${timestamp}_${index}.${file.name.split('.').pop()}`;
        const storageRef = ref(storage, `properties/${fileName}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    });

    return Promise.all(uploadPromises);
};
