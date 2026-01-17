import React, { useEffect, useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { getPropertyById } from '../services/propertyService';
import type { Property } from '../types/property';
import { PropertyCard } from '../components/inmobiliaria/PropertyCard';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Heart, ArrowLeft, Search } from 'lucide-react';
import { SEOHeaders } from '../components/seo/SEOHeaders';

export const FavoritesPage: React.FC = () => {
    const { favorites } = useFavorites();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                // Fetch all favorited properties
                // Ideally backend would support fetching by array of IDs, but we'll loop for now as list is small
                const promises = favorites.map(id => getPropertyById(id));
                const results = await Promise.all(promises);
                // Filter out nulls (deleted props)
                setProperties(results.filter((p): p is Property => p !== null));
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        if (favorites.length > 0) {
            fetchFavorites();
        } else {
            setProperties([]);
            setLoading(false);
        }
    }, [favorites]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 container-custom">
            <SEOHeaders title="Mis Favoritos" description="Tus propiedades guardadas para revisar más tarde." />
            <div className="flex items-center gap-4 mb-8">
                <Link to="/propiedades">
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                </Link>
                <h1 className="text-4xl font-serif font-bold flex items-center gap-3">
                    <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                    Mis Favoritos
                </h1>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <Heart className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                        No tienes favoritos guardados
                    </h2>
                    <p className="text-[var(--color-text-light)] mb-8 max-w-md mx-auto">
                        Marca las propiedades con el corazón ❤️ mientras navegas para guardarlas aquí y compararlas después.
                    </p>
                    <Link to="/propiedades">
                        <Button size="lg" className="flex items-center gap-2 mx-auto">
                            <Search className="w-5 h-5" />
                            Explorar Propiedades
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
};
