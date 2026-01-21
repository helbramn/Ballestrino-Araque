import React from 'react';
import type { Encargo } from '../../types/encargo';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface EncargoCardProps {
    encargo: Encargo;
}

export const EncargoCard: React.FC<EncargoCardProps> = ({ encargo }) => {
    const formatDate = (date: any) => {
        if (!date) return 'Fecha desconocida';
        if (date.seconds) {
            return new Date(date.seconds * 1000).toLocaleDateString();
        }
        return new Date(date).toLocaleDateString();
    };

    return (
        <Card className="h-full border-l-4 border-l-[var(--color-primary)]">
            <div className="flex justify-between items-start mb-2">
                <Badge variant="default" className="uppercase text-xs tracking-wider">
                    {encargo.operation}
                </Badge>
                <span className="text-xs text-[var(--color-text-light)]">
                    {formatDate(encargo.createdAt)}
                </span>
            </div>

            <h3 className="text-lg font-bold mb-2 text-[var(--color-primary)]">
                {encargo.type && <span className="mr-2">{encargo.type}</span>}
                {encargo.priceMax ? `hasta ${encargo.priceMax.toLocaleString()} €` : 'Presupuesto Flexible'}
            </h3>

            <div className="flex flex-wrap gap-3 mb-4 text-sm text-[var(--color-text-light)]">
                {encargo.zone && (
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        📍 {encargo.zone}
                    </span>
                )}
                {encargo.bedrooms && (
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        🛏️ {encargo.bedrooms}+ hab
                    </span>
                )}
                {encargo.bathrooms && (
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        🚿 {encargo.bathrooms}+ baños
                    </span>
                )}
            </div>

            <p className="text-sm text-[var(--color-text)] italic line-clamp-4 leading-relaxed bg-[#F9F9F9] p-3 rounded-lg border border-[#F0F0F0]">
                "{encargo.description}"
            </p>
        </Card>
    );
};
