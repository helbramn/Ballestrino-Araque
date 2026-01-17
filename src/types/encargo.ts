export interface Encargo {
    id?: string;
    name: string;
    email: string;
    phone: string;
    operation: 'venta' | 'alquiler' | 'opcion_compra';
    type: string;
    priceMin?: number;
    priceMax?: number;
    zone?: string;
    bedrooms?: number;
    bathrooms?: number;
    description: string;
    createdAt?: any;
    published?: boolean;
    energyCertificate?: string;
}
