import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import type { Encargo } from '../types/encargo';

export type { Encargo };

const ENCARGOS_COLLECTION = 'encargos';

export const createEncargo = async (data: Omit<Encargo, 'id' | 'createdAt'>): Promise<string> => {
    const collectionRef = collection(db, ENCARGOS_COLLECTION);
    const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const getEncargos = async (): Promise<Encargo[]> => {
    const collectionRef = collection(db, ENCARGOS_COLLECTION);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Encargo));
};

export const getPublishedEncargos = async (): Promise<Encargo[]> => {
    const collectionRef = collection(db, ENCARGOS_COLLECTION);
    const q = query(
        collectionRef,
        where('published', '==', true)
    );
    const snapshot = await getDocs(q);

    const encargos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Encargo));

    return encargos.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
    });
};

export const updateEncargo = async (id: string, data: Partial<Encargo>): Promise<void> => {
    const docRef = doc(db, ENCARGOS_COLLECTION, id);
    await updateDoc(docRef, data);
};

export const deleteEncargo = async (id: string): Promise<void> => {
    const docRef = doc(db, ENCARGOS_COLLECTION, id);
    await deleteDoc(docRef);
};

export const seedEncargos = async (): Promise<void> => {
    const testEncargos: Omit<Encargo, 'id' | 'createdAt'>[] = [
        {
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: '600123456',
            operation: 'venta',
            type: 'Piso',
            priceMin: 150000,
            priceMax: 250000,
            zone: 'Centro',
            bedrooms: 3,
            bathrooms: 2,
            description: 'Busco piso luminoso con terraza.',
            published: true
        },
        {
            name: 'María García',
            email: 'maria.garcia@example.com',
            phone: '600654321',
            operation: 'alquiler',
            type: 'Casa',
            priceMax: 1200,
            zone: 'Alrededores',
            bedrooms: 4,
            description: 'Casa con jardín para familia con mascotas.',
            published: false
        },
        {
            name: 'Carlos Rodríguez',
            email: 'carlos.rod@example.com',
            phone: '600987654',
            operation: 'venta',
            type: 'Terreno',
            priceMax: 80000,
            zone: 'Sierra',
            description: 'Terreno edificable con buenas vistas.',
            published: true
        },
        {
            name: 'Ana Martínez',
            email: 'ana.martinez@example.com',
            phone: '600111222',
            operation: 'opcion_compra',
            type: 'Piso',
            priceMax: 200000,
            zone: 'Norte',
            bedrooms: 2,
            bathrooms: 1,
            description: 'Piso reformado, listo para entrar a vivir.',
            published: false
        },
        {
            name: 'Luis Sánchez',
            email: 'luis.sanchez@example.com',
            phone: '600333444',
            operation: 'venta',
            type: 'Local',
            priceMax: 100000,
            zone: 'Comercial',
            description: 'Local para abrir una cafetería.',
            published: true
        }
    ];

    for (const encargo of testEncargos) {
        await createEncargo(encargo);
    }
};

export const deleteAllEncargos = async (): Promise<void> => {
    const collectionRef = collection(db, ENCARGOS_COLLECTION);
    const snapshot = await getDocs(collectionRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};
