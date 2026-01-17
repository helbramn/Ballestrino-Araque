export interface Property {
    id: string;
    title: string;
    operation: "venta" | "alquiler" | "opcion_compra";
    price: number;
    zone: string;
    type: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    mainImage: string;
    images: string[];
    features?: string[];
    location?: {
        lat: number;
        lng: number;
        address?: string;
    };
    highlighted?: boolean;
    town?: string;
    energyCertificate?: string;
    isVIP?: boolean;
}
