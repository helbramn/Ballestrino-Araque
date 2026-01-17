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

            <h3 className="text-lg font-bold mb-1">
                {encargo.priceMax ? `Hasta ${encargo.priceMax.toLocaleString()} €` : 'Presupuesto a consultar'}
            </h3>
            <p className="text-sm text-[var(--color-text-light)] mb-3">📍 Zona: {encargo.zone}</p>

            <p className="text-sm text-[var(--color-text)] italic">
                "{encargo.description}"
            </p>
        </Card>
    );
};
