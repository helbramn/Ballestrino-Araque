export interface Encargo {
    id: string;
    operation: "compra" | "alquiler" | "opcion_compra";
    budget: number;
    zone: string;
    description: string;
    createdAt: string;
}
