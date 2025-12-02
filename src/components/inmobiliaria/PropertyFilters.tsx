import React from 'react';
import { Select } from '../ui/Select';

interface PropertyFiltersProps {
    filters: {
        operation: string;
        zone: string;
        type: string;
    };
    onFilterChange: (name: string, value: string) => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFilterChange }) => {
    return (
        <div className="bg-white p-4 rounded-[var(--radius-md)] shadow-sm border border-[var(--color-border)] mb-8">
            <div className="grid gap-4 md:grid-cols-3">
                <Select
                    label="Operación"
                    value={filters.operation}
                    onChange={(e) => onFilterChange('operation', e.target.value)}
                    options={[
                        { value: 'all', label: 'Todas' },
                        { value: 'venta', label: 'Venta' },
                        { value: 'alquiler', label: 'Alquiler' }
                    ]}
                />

                <Select
                    label="Zona"
                    value={filters.zone}
                    onChange={(e) => onFilterChange('zone', e.target.value)}
                    options={[
                        { value: 'all', label: 'Todas las zonas' },
                        { value: 'Segovia', label: 'Segovia' },
                        { value: 'La Granja', label: 'La Granja' },
                        { value: 'El Espinar', label: 'El Espinar' },
                        { value: 'Pedraza', label: 'Pedraza' }
                    ]}
                />

                <Select
                    label="Tipo de inmueble"
                    value={filters.type}
                    onChange={(e) => onFilterChange('type', e.target.value)}
                    options={[
                        { value: 'all', label: 'Todos los tipos' },
                        { value: 'Casa Rústica', label: 'Casa Rústica' },
                        { value: 'Masía', label: 'Masía' },
                        { value: 'Cortijo', label: 'Cortijo' },
                        { value: 'Piso', label: 'Piso' }
                    ]}
                />
            </div>
        </div>
    );
};
