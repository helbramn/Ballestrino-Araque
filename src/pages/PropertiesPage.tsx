import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '../components/inmobiliaria/PropertyCard';
import { PropertyFilters } from '../components/inmobiliaria/PropertyFilters';
import { getProperties } from '../services/propertyService';
import { SEOHeaders } from '../components/seo/SEOHeaders';

export const PropertiesPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        operation: 'all',
        zone: 'all',
        type: 'all',
        features: [] as string[]
    });

    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(true);

    // Initialize filters from URL params
    useEffect(() => {
        const operation = searchParams.get('operation');
        const type = searchParams.get('type');
        const featuresParam = searchParams.get('features');

        setFilters(prev => ({
            ...prev,
            operation: operation || 'all',
            type: type || 'all',
            features: featuresParam ? featuresParam.split(',') : []
        }));
    }, [searchParams]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getProperties();
                setAllProperties(data);
            } catch (error: any) {
                console.error("Error fetching properties:", error);
                setError(`Error al cargar propiedades: ${error.message || 'Desconocido'}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredProperties = useMemo(() => {
        return allProperties.filter(property => {
            if (filters.operation !== 'all' && property.operation !== filters.operation) return false;
            if (filters.zone !== 'all' && property.zone !== filters.zone) return false;
            if (filters.type !== 'all' && property.type !== filters.type) return false;

            // Feature filtering
            if (filters.features.length > 0) {
                const pFeatures = property.features || [];
                // Check if property has ALL selected features (strict)
                const hasAll = filters.features.every(f => pFeatures.includes(f));
                if (!hasAll) return false;
            }

            return true;
        });
    }, [filters, allProperties]);

    return (
        <div className="container-custom py-12 pt-32">
            <SEOHeaders
                title="Propiedades"
                description="Descubre nuestra selección de propiedades singulares en la Sierra de Segovia."
            />
            <div className="mb-8">
                <h1 className="mb-4">Nuestras Propiedades</h1>
                <p className="text-[var(--color-text-light)] max-w-2xl">
                    Explora nuestra cartera de inmuebles singulares.
                    Utiliza los filtros para encontrar exactamente lo que buscas.
                </p>
                {filters.features.length > 0 && (
                    <div className="mt-4 flex gap-2">
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            Filtrando por: {filters.features.join(', ')}
                        </span>
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, features: [] }))}
                            className="text-xs text-gray-500 underline self-center"
                        >
                            Limpiar extras
                        </button>
                    </div>
                )}
            </div>

            <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                    {error ? (
                        <div className="max-w-md mx-auto">
                            <p className="text-red-500 font-semibold mb-2">⚠ Error de Conexión</p>
                            <p className="text-sm text-gray-600 mb-4">{error}</p>
                            <p className="text-xs text-gray-500">
                                Es necesario configurar los permisos en Firebase Console &gt; Firestore &gt; Rules para permitir lectura pública.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xl text-[var(--color-text-light)] mb-2">No se encontraron propiedades</p>
                            <p className="text-sm text-[var(--color-text-light)]">Prueba con otros filtros</p>
                            <button
                                onClick={() => window.location.href = '/propiedades'}
                                className="mt-4 text-[var(--color-primary)] underline"
                            >
                                Ver todas
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-6 text-[var(--color-text-light)]">
                        Mostrando {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
