export interface Property {
    id: string;
    title: string;
    location: string;
    price: string;
    size: string;
    rooms: number;
    bathrooms: number;
    image: string;
    description: string;
    features: string[];
}

export interface Feature {
    id: string;
    title: string;
    description: string;
    icon?: string;
}

export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    schedule: string;
}

export interface Stat {
    label: string;
    value: string;
}
