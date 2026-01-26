import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { PropertyMap } from '../components/ui/PropertyMap';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { SEOHeaders } from '../components/seo/SEOHeaders';
import { ArrowLeft, MapPin, Home, Bed, Bath, Maximize2, Mail, Phone } from 'lucide-react';
import type { Property } from '../types/property';
import { transformGoogleDriveUrl } from '../utils/imageUtils';

export const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProperty = async () => {
            if (!id) return;
            try {
                const data = await getPropertyById(id);
                setProperty(data);
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
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

    // Fallback image logic - Transform Drive URLs on-the-fly
    const displayImage = transformGoogleDriveUrl(property.mainImage || '');

    // Fallback gallery images - Transform Drive URLs
    const displayImages = (property.images || []).map(transformGoogleDriveUrl);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": property.title,
        "image": displayImages,
        "description": property.description,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": property.price,
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <SEOHeaders
                title={property.title}
                description={property.description?.substring(0, 160)}
                image={displayImage}
                structuredData={schema}
            />
            {/* Breadcrumb & Back */}
            <div className="container-custom py-6 border-b border-[var(--color-border)]">
                <Link to="/propiedades" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a propiedades
                </Link>
            </div>

            {/* Hero Image */}
            <div className="relative">
                {displayImage ? (
                    <div
                        className="h-[60vh] bg-cover bg-center cursor-pointer"
                        style={{ backgroundImage: `url(${displayImage})` }}
                        onClick={() => openLightbox(0)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                ) : (
                    <div className="h-[40vh] bg-[var(--color-bg-alt)] flex items-center justify-center border-b border-[var(--color-border)]">
                        <span className="text-[var(--color-text-light)] flex flex-col items-center gap-2">
                            📷 Sin foto principal
                        </span>
                    </div>
                )}
            </div>

            {/* Property Content */}
            <div className="container-custom py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Badge className="mb-4">{operationLabels[property.operation]}</Badge>
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-4xl font-serif font-bold">{property.title}</h1>
                                <FavoriteButton propertyId={property.id} size={32} className="mt-1" />
                            </div>
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
                            <div className="flex flex-col items-center text-center">
                                {/* Only show circle for single letter grades A-G */}
                                {property.energyCertificate && /^[A-G]$/i.test(property.energyCertificate) ? (
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-2 bg-green-500">
                                        {property.energyCertificate.toUpperCase()}
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 mb-2 border border-[var(--color-primary)]">
                                        <span className="text-xs">CE</span>
                                    </div>
                                )}
                                <span className="text-sm text-[var(--color-text-light)]">Certificado</span>
                                <span className="font-semibold text-sm">{property.energyCertificate || 'En proceso'}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                            <p className="text-[var(--color-text)] leading-relaxed">{property.description}</p>
                        </div>

                        {/* Map */}
                        {property.location && property.location.lat !== 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">Ubicación</h2>
                                <PropertyMap
                                    lat={property.location.lat}
                                    lng={property.location.lng}
                                    title={property.title}
                                />
                            </div>
                        )}

                        {/* Gallery */}
                        {displayImages.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">Galería</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {displayImages.map((image, index) => (
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
                                    onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=araquecarlota77@gmail.com', '_blank')}
                                >
                                    <Mail className="w-5 h-5" />
                                    Enviar email
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={() => window.location.href = 'tel:+34722713530'}
                                >
                                    <Phone className="w-5 h-5" />
                                    Llamar ahora
                                </Button>
                            </div>
                            <div className="mt-4 space-y-2 text-center">
                                <p className="text-base font-medium">
                                    Solo llamadas tardes (18:00 - 20:00)
                                </p>
                                <p className="text-xs text-[var(--color-primary)] font-medium">
                                    * Preferible contacto por email
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {
                displayImages.length > 0 && (
                    <ImageLightbox
                        images={displayImages}
                        isOpen={lightboxOpen}
                        currentIndex={lightboxIndex}
                        onClose={() => setLightboxOpen(false)}
                        onNext={() => setLightboxIndex((prev) => (prev + 1) % displayImages.length)}
                        onPrev={() => setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                    />
                )
            }
        </div >
    );
};
