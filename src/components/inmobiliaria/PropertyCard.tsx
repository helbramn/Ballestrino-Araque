import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types/property';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { MapPin, Ruler, BedDouble, Bath } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <Card hover className="flex flex-col h-full group transition-all duration-300 hover:shadow-xl">
            {/* Image */}
            <Link to={`/propiedad/${property.id}`} className="block relative mb-4 aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
                {property.mainImage ? (
                    <img
                        src={property.mainImage}
                        alt={property.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <img
                        src={`/properties/prop${(property.id.length % 4) + 1}.png`}
                        alt={property.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="flex flex-col gap-2">
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

                        {/* VIP Badge */}
                        {property.isVIP && (
                            <Badge className="bg-[#D4AF37] text-white border-none shadow-lg font-bold animate-pulse flex items-center gap-1">
                                💎 COLECCIÓN PREMIUM
                            </Badge>
                        )}

                        {/* Price Badge */}
                        <Badge variant="accent" className="bg-white/95 backdrop-blur-sm shadow-lg font-bold text-[var(--color-primary)] w-fit">
                            {property.price.toLocaleString('es-ES')} €{property.operation !== 'venta' && '/mes'}
                        </Badge>
                    </div>

                    <FavoriteButton propertyId={property.id} />
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
        </Card>
    );
};
