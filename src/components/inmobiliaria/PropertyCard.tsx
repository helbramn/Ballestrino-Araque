import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types/property';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, Ruler, BedDouble, Bath, ArrowRight, Home } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <Card hover className="flex flex-col h-full group transition-all duration-300 hover:shadow-xl">
            {/* Image */}
            <Link to={`/propiedad/${property.id}`} className="block relative mb-4 aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
                {/* Placeholder for real image or gradient fallback */}
                <div className="h-full w-full bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-500">
                    <Home className="w-12 h-12 opacity-50" />
                </div>

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {/* Operation Type Badge */}
                    <Badge
                        variant={property.operation === 'opcion_compra' ? 'accent' : 'default'}
                        className={`${property.operation === 'venta' ? 'bg-emerald-600 text-white' :
                            property.operation === 'alquiler' ? 'bg-blue-600 text-white' :
                                'bg-gradient-to-r from-blue-600 to-emerald-600 text-white animate-pulse'
                            } backdrop-blur-sm shadow-lg font-bold ${property.operation === 'opcion_compra' ? 'text-xs' : ''}`}
                    >
                        {property.operation === 'venta' ? '● VENTA' :
                            property.operation === 'alquiler' ? '● ALQUILER' :
                                'ALQUILER+VENTA'}
                    </Badge>

                    {/* Price Badge */}
                    <Badge variant="accent" className="bg-white/95 backdrop-blur-sm shadow-lg font-bold text-[var(--color-primary)]">
                        {property.price.toLocaleString('es-ES')} €{property.operation !== 'venta' && '/mes'}
                    </Badge>
                </div>
            </Link>

            {/* Content */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <Link to={`/propiedad/${property.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                        <h3 className="text-xl font-serif font-semibold line-clamp-1">{property.title}</h3>
                    </Link>
                </div>

                <p className="text-sm text-[var(--color-text-light)] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                    {property.zone}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-light)] py-3 border-y border-[var(--color-border)]/50">
                    <span className="flex items-center gap-1.5">
                        <Ruler className="w-4 h-4" /> {property.area} m²
                    </span>
                    <span className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4" /> {property.bathrooms}
                    </span>
                </div>

                <p className="text-sm leading-relaxed text-[var(--color-text-light)] line-clamp-2">
                    {property.description}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2">
                <Link to={`/propiedad/${property.id}`} className="w-full block">
                    <Button variant="secondary" className="w-full group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors flex items-center justify-center gap-2">
                        Ver Detalles
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
};
