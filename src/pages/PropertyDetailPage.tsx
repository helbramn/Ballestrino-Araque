import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { properties } from '../data/properties';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { MapPin, Ruler, BedDouble, Bath, ArrowLeft, Home, Image as ImageIcon, Calendar, Info, Phone, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const property = properties.find(p => p.id === id);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Mock images array (since we don't have real URLs yet)
    const images = [1, 2, 3];

    if (!property) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="mb-4">Propiedad no encontrada</h2>
                <Link to="/propiedades">
                    <Button>Volver al listado</Button>
                </Link>
            </div>
        );
    }

    const handleContact = (type: 'visit' | 'info') => {
        const subject = type === 'visit' ? `Solicitud de visita: ${property.title}` : `Información sobre: ${property.title}`;
        const body = `Hola, estoy interesado en la propiedad "${property.title}" (Ref: ${property.id})...`;
        window.location.href = `mailto:info@carlotainmob.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleCall = () => {
        window.location.href = 'tel:+34921000000';
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="container-custom py-12 pt-32 animate-in fade-in duration-500">
            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setLightboxOpen(false)}>
                    <button className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-[110] p-2">
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-3 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm z-[110]"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                    </button>

                    <button
                        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-3 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm z-[110]"
                        onClick={nextImage}
                    >
                        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                    </button>

                    <div className="relative w-full max-w-6xl max-h-[85vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] w-full aspect-video md:aspect-[16/9] rounded-lg flex items-center justify-center transition-all duration-300 shadow-2xl">
                            <Home className="w-24 h-24 md:w-48 md:h-48 text-white/50" />
                            <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center px-4">
                                <p className="text-white/90 text-lg md:text-xl font-medium">Imagen {currentImageIndex + 1} de {images.length}</p>
                                <p className="text-white/60 text-sm mt-1">Vista previa (Placeholder)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <Link to="/propiedades" className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Volver a propiedades
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="mb-2 text-3xl md:text-4xl">{property.title}</h1>
                        <p className="text-lg text-[var(--color-text-light)] flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> {property.zone} • {property.type}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-[var(--color-primary)]">
                            {property.price.toLocaleString('es-ES')} €
                        </p>
                        <Badge variant="default" className="mt-2 uppercase tracking-wider">
                            {property.operation}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Gallery Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 mb-12 h-[400px] md:h-[500px]">
                <div
                    className="h-full bg-gray-200 rounded-[var(--radius-lg)] overflow-hidden relative group cursor-zoom-in"
                    onClick={() => { setCurrentImageIndex(0); setLightboxOpen(true); }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <Home className="w-24 h-24 text-white/50" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Foto Principal
                    </div>
                </div>
                <div className="grid grid-rows-2 gap-4">
                    <div
                        className="bg-gray-100 rounded-[var(--radius-lg)] relative overflow-hidden group cursor-zoom-in"
                        onClick={() => { setCurrentImageIndex(1); setLightboxOpen(true); }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                    </div>
                    <div
                        className="bg-gray-100 rounded-[var(--radius-lg)] relative overflow-hidden group cursor-zoom-in"
                        onClick={() => { setCurrentImageIndex(2); setLightboxOpen(true); }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h3 className="text-2xl mb-4 font-serif">Descripción</h3>
                        <p className="text-[var(--color-text-light)] leading-relaxed text-lg whitespace-pre-line">
                            {property.description}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl mb-6 font-serif">Características</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <Card className="text-center py-6 hover:border-[var(--color-primary)]/30 transition-colors">
                                <Ruler className="w-8 h-8 mx-auto mb-3 text-[var(--color-primary)]" />
                                <span className="font-bold block text-lg">{property.area} m²</span>
                                <span className="text-sm text-gray-500">Construidos</span>
                            </Card>
                            <Card className="text-center py-6 hover:border-[var(--color-primary)]/30 transition-colors">
                                <BedDouble className="w-8 h-8 mx-auto mb-3 text-[var(--color-primary)]" />
                                <span className="font-bold block text-lg">{property.bedrooms}</span>
                                <span className="text-sm text-gray-500">Habitaciones</span>
                            </Card>
                            <Card className="text-center py-6 hover:border-[var(--color-primary)]/30 transition-colors">
                                <Bath className="w-8 h-8 mx-auto mb-3 text-[var(--color-primary)]" />
                                <span className="font-bold block text-lg">{property.bathrooms}</span>
                                <span className="text-sm text-gray-500">Baños</span>
                            </Card>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 sticky top-24 border-t-4 border-t-[var(--color-primary)] shadow-lg">
                        <h3 className="text-xl mb-4 font-serif">¿Te interesa?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Contacta con nosotros para agendar una visita o solicitar más información sobre esta propiedad.
                        </p>

                        <div className="space-y-3">
                            <Button className="w-full flex items-center justify-center gap-2" onClick={() => handleContact('visit')}>
                                <Calendar className="w-4 h-4" /> Agendar Visita
                            </Button>
                            <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => handleContact('info')}>
                                <Info className="w-4 h-4" /> Solicitar Info
                            </Button>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2 mt-2" onClick={handleCall}>
                                <Phone className="w-4 h-4" /> Llamar ahora
                            </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
                            Ref: {property.id}
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
};
