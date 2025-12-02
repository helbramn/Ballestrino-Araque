import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import type { Property } from '../types/property';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { ArrowLeft, MapPin, Home, Bed, Bath, Maximize2, Mail, Phone } from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        const loadProperty = async () => {
            if (!id) return;

            try {
                const data = await getPropertyById(id);
                setProperty(data);
            } catch (error) {
                console.error('Error loading property:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProperty();
    }, [id]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (loading) {
        return (
            <div className="container-custom py-32 flex items-center justify-center min-h-screen">
                <p className="text-[var(--color-text-light)] text-lg">Cargando propiedad...</p>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container-custom py-32 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Propiedad no encontrada</h1>
                <p className="text-[var(--color-text-light)] mb-8">
                    La propiedad que buscas no existe o ha sido eliminada
                </p>
                <Link to="/propiedades">
                    <Button className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a propiedades
                    </Button>
                </Link>
            </div>
        );
    }

    const operationLabels: Record<Property['operation'], string> = {
        venta: 'En venta',
        alquiler: 'En alquiler',
        opcion_compra: 'Alquiler con opción a compra'
    };

    return (
        <div className="min-h-screen pt-20">
            {/* Breadcrumb & Back */}
            <div className="container-custom py-6 border-b border-[var(--color-border)]">
                <Link to="/propiedades" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a propiedades
                </Link>
            </div>

            {/* Hero Image */}
            <div className="relative">
                <div
                    className="h-[60vh] bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${property.mainImage})` }}
                    onClick={() => openLightbox(0)}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            </div>

            {/* Property Content */}
            <div className="container-custom py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Badge className="mb-4">{operationLabels[property.operation]}</Badge>
                            <h1 className="text-4xl font-serif font-bold mb-4">{property.title}</h1>
                            <div className="flex items-center gap-2 text-[var(--color-text-light)] mb-6">
                                <MapPin className="w-5 h-5" />
                                <span className="text-lg">{property.zone}</span>
                            </div>
                            <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                                {property.price.toLocaleString('es-ES')} €
                                {property.operation.includes('alquiler') && <span className="text-xl">/mes</span>}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-[var(--color-background)] rounded-lg">
                            <div className="flex flex-col items-center text-center">
                                <Home className="w-8 h-8 text-[var(--color-primary)] mb-2" />
                                <span className="text-sm text-[var(--color-text-light)]">Tipo</span>
                                <span className="font-semibold">{property.type}</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Maximize2 className="w-8 h-8 text-[var(--color-primary)] mb-2" />
                                <span className="text-sm text-[var(--color-text-light)]">Superficie</span>
                                <span className="font-semibold">{property.area} m²</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Bed className="w-8 h-8 text-[var(--color-primary)] mb-2" />
                                <span className="text-sm text-[var(--color-text-light)]">Habitaciones</span>
                                <span className="font-semibold">{property.bedrooms}</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Bath className="w-8 h-8 text-[var(--color-primary)] mb-2" />
                                <span className="text-sm text-[var(--color-text-light)]">Baños</span>
                                <span className="font-semibold">{property.bathrooms}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                            <p className="text-[var(--color-text)] leading-relaxed">{property.description}</p>
                        </div>

                        {/* Gallery */}
                        {property.images && property.images.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">Galería</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-video bg-cover bg-center rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            style={{ backgroundImage: `url(${image})` }}
                                            onClick={() => openLightbox(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-6 bg-white rounded-lg shadow-lg border border-[var(--color-border)]">
                            <h3 className="text-xl font-semibold mb-4">¿Interesado en esta propiedad?</h3>
                            <p className="text-[var(--color-text-light)] mb-6">
                                Contacta con nosotros y te ayudaremos encantados
                            </p>
                            <div className="space-y-4">
                                <Button
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={() => window.location.href = 'mailto:info@carlotainmob.com'}
                                >
                                    <Mail className="w-5 h-5" />
                                    Enviar email
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={() => window.location.href = 'tel:+34123456789'}
                                >
                                    <Phone className="w-5 h-5" />
                                    Llamar ahora
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {property.images && (
                <ImageLightbox
                    images={property.images}
                    isOpen={lightboxOpen}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                    onNext={() => setLightboxIndex((prev) => (prev + 1) % property.images.length)}
                    onPrev={() => setLightboxIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                />
            )}
        </div>
    );
};
