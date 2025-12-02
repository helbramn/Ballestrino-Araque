import React, { useState, useMemo } from 'react';
import { PropertyCard } from '../components/inmobiliaria/PropertyCard';
import { PropertyFilters } from '../components/inmobiliaria/PropertyFilters';
import { properties } from '../data/properties';

export const PropertiesPage: React.FC = () => {
    const [filters, setFilters] = useState({
        operation: 'all',
        zone: 'all',
        type: 'all'
    });

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            if (filters.operation !== 'all' && property.operation !== filters.operation) return false;
            if (filters.zone !== 'all' && property.zone !== filters.zone) return false;
            if (filters.type !== 'all' && property.type !== filters.type) return false;
            return true;
        });
    }, [filters]);

    return (
        <div className="container-custom py-12 pt-32">
            <div className="mb-8">
                <h1 className="mb-4">Nuestras Propiedades</h1>
                <p className="text-[var(--color-text-light)] max-w-2xl">
                    Explora nuestra cartera de inmuebles rústicos y singulares.
                    Utiliza los filtros para encontrar exactamente lo que buscas.
                </p>
            </div>

            <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />

            {filteredProperties.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[var(--radius-lg)] border border-dashed border-gray-200">
                    <p className="text-xl text-gray-500 mb-2">No se encontraron propiedades</p>
                    <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}
        </div>
    );
};
