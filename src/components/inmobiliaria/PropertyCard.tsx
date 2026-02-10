import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types/property';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { MapPin, Ruler, BedDouble, Bath } from 'lucide-react';
import { transformGoogleDriveUrl } from '../../utils/imageUtils';

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
                        src={transformGoogleDriveUrl(property.mainImage)}
                        alt={property.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden'); // logic to show fallback if we had one separate, but here we can just hide
                        }}
                    />
                ) : (
                    <div className="h-full w-full bg-[var(--color-bg-alt)] flex items-center justify-center border border-[var(--color-border)]">
                        <span className="text-[var(--color-text-light)] text-sm flex flex-col items-center gap-2">
                            📷 Sin fotos
                        </span>
                    </div>
                )}

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="flex flex-col gap-2">
                        {/* Operation Type Badge */}
                        <Badge
                            className={`
                                ${property.operation === 'venta'
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                                    : property.operation === 'alquiler'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        : 'bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 text-white animate-pulse'
                                } 
                                backdrop-blur-md shadow-xl font-bold uppercase tracking-wider
                                border-2 border-white/30 px-3 py-1.5 text-sm
                                transition-all duration-300 hover:scale-105 hover:shadow-2xl
                            `}
                        >
                            {property.operation === 'venta' ? '🏷️ VENTA' :
                                property.operation === 'alquiler' ? '🔑 ALQUILER' :
                                    '⭐ ALQUILER CON OPCIÓN A COMPRA'}
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

                {/* VENDIDO/ALQUILADO Overlay */}
                {(property.status === 'vendida' || property.status === 'alquilada') && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className={`
                            ${property.status === 'vendida'
                                ? 'bg-gradient-to-r from-green-600 to-green-700'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700'
                            }
                            text-white font-black text-3xl md:text-4xl px-8 py-4 rounded-2xl 
                            shadow-2xl border-4 border-white/30 transform rotate-[-5deg]
                            uppercase tracking-widest
                        `}>
                            {property.status === 'vendida' ? '✓ VENDIDO' : '✓ ALQUILADO'}
                        </div>
                    </div>
                )}
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
