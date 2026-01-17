import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

export interface AppSettings {
    magazineUrl?: string;
    magazineActive?: boolean;
    quizFeatures?: string[];
    updatedAt?: any;
}

const SETTINGS_COLLECTION = 'settings';
const GENERAL_DOC_ID = 'general';

export const getSettings = async (): Promise<AppSettings> => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        return snapshot.data() as AppSettings;
    }

    return { magazineUrl: '', magazineActive: false };
};

export const updateSettings = async (settings: Partial<AppSettings>): Promise<void> => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);

    // Check if exists first to decide between set (merge) or update
    // setDoc with merge: true is safer if document might not exist
    await setDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
    }, { merge: true });
};
