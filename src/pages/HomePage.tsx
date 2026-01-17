import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PropertyCard } from '../components/inmobiliaria/PropertyCard';
import { AdvisoryCardStack } from '../components/inmobiliaria/AdvisoryCardStack';
import { getProperties } from '../services/propertyService';
import { ClipboardList, Search } from 'lucide-react';

import { SEOHeaders } from '../components/seo/SEOHeaders';

import { getSettings } from '../services/settingsService';

export const HomePage: React.FC = () => {
    const [randomProperties, setRandomProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [magazineSettings, setMagazineSettings] = useState({ magazineUrl: '', magazineActive: false });

    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Ballestrino-Araque",
        "image": "https://ballestrino-araque.com/images/ballestrino-logo.png",
        "description": "Inmobiliaria de confianza especialistas en propiedades singulares en la Sierra de Segovia.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Segovia",
            "addressRegion": "Segovia",
            "addressCountry": "ES"
        },
        "telephone": "+34 722 71 35 30",
        "url": "https://ballestrino-araque.com"
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const [propertiesData, settingsData] = await Promise.all([
                    getProperties(),
                    getSettings()
                ]);

                // Filter only highlighted properties
                const highlighted = propertiesData.filter(p => p.highlighted);

                // If no highlighted properties, fallback to showing ALL properties (sorted by date ideally, or just random)
                // This fix ensures that if the user created properties but forgot to check "Destacada", they still see something.
                const propertiesToShow = highlighted.length > 0 ? highlighted : propertiesData;

                // If we have properties, slice the first 6
                if (propertiesToShow.length > 0) {
                    setRandomProperties(propertiesToShow.slice(0, 6));
                } else {
                    // Start with empty to show "No properties" message
                    setRandomProperties([]);
                }

                // Set settings (cast to expected type safely if needed, though interface matches)
                if (settingsData) {
                    setMagazineSettings({
                        magazineUrl: settingsData.magazineUrl || '',
                        magazineActive: settingsData.magazineActive || false
                    });
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="space-y-20 pb-20">
            <SEOHeaders
                title="Inicio"
                structuredData={schema}
            />
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-[80vh] flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/sierra-view.png"
                        alt="Sierra de El Espinar"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                <div className="container-custom relative z-10 text-white">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text */}
                        <div className="text-center lg:text-left space-y-8">
                            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wider uppercase bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                                Ballestrino-Araque
                            </span>

                            <h1 className="text-balance text-4xl lg:text-6xl font-serif leading-tight animate-fade-in-up text-white" style={{ animationDelay: '0.2s' }}>
                                No espere para comprar, <span className="text-[#D4AF37]">compre y espere</span>
                            </h1>

                            <p className="text-lg text-gray-200 text-balance leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                Inmobiliaria de Confianza. Especialistas en propiedades singulares.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                                <Link to="/propiedades">
                                    <Button size="lg">Ver Propiedades</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Advisory Card Stack */}
                        <div className="relative hidden lg:block">
                            <AdvisoryCardStack />
                        </div>
                        {/* Mobile view for cards */}
                        <div className="lg:hidden">
                            <AdvisoryCardStack />
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/5 blur-3xl"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[var(--color-accent)]/5 blur-3xl"></div>
                </div>
            </section>

            {/* Quiz CTA Section */}
            <section className="py-20 bg-[var(--color-primary)] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container-custom relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6">¿No sabes por dónde empezar?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Realiza nuestro test de 1 minuto y descubre qué propiedades encajan mejor con tu estilo de vida.
                    </p>
                    <Link to="/quiz">
                        <Button
                            size="lg"
                            className="bg-white text-[var(--color-primary)] hover:bg-gray-100 border-none text-lg px-10 py-6 h-auto shadow-2xl"
                        >
                            Empezar el Test
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="container-custom">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="mb-2">Propiedades Destacadas</h2>
                        <p className="text-[var(--color-text-light)]">Descubre nuestras incorporaciones más exclusivas</p>
                    </div>
                    <Link to="/propiedades" className="hidden md:block">
                        <Button variant="secondary" size="sm">Ver todas</Button>
                    </Link>
                </div>

                {/* Responsive Infinite Carousel */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                ) : randomProperties.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[var(--color-text-light)]">No hay propiedades destacadas disponibles</p>
                    </div>
                ) : (
                    <Carousel items={randomProperties} />
                )}
            </section>

            {/* Encargos Section - Gold Rustic Style */}
            <section className="bg-[var(--color-primary)] py-24 border-t border-[var(--color-primary-dark)] relative overflow-hidden">
                {/* Background Pattern/Texture */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                <div className="container-custom relative z-10">
                    <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-semibold mb-6">
                                    <ClipboardList className="w-4 h-4" />
                                    <span>Servicio Personalizado</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[var(--color-text)]">Buzón de Encargos</h2>
                                <p className="text-[var(--color-text-light)] text-lg mb-8 leading-relaxed">
                                    ¿Buscas una propiedad con características específicas? Cuéntanos qué necesitas.
                                    Nuestro equipo activará una búsqueda personalizada en nuestra red de propietarios
                                    y oportunidades off-market para encontrar tu hogar ideal.
                                </p>
                                <Link to="/encargos" className="inline-flex items-center justify-center rounded-full font-semibold transition-all btn-primary px-8 py-4 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                    Realizar Encargo
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-[var(--color-background)] p-8 flex items-center justify-center border border-[#E5E5E0]">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
                                            <Search className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold mb-2">Búsqueda Activa</h3>
                                        <p className="text-sm text-[var(--color-text-light)]">
                                            Rastreamos el mercado por ti
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#8B4513]/10 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* El Periódico del Pueblo Section */}
            <section className="container-custom py-8">
                <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center">
                    {/* Background */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/sierra-view.png"
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 max-w-2xl text-white">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#D4AF37] text-black mb-4">
                            Lifestyle & Cultura
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif mb-4 leading-tight">
                            El Periódico del Pueblo
                        </h2>
                        <p className="text-base text-gray-200 mb-6 leading-relaxed">
                            Descubre la verdadera esencia de vivir en la sierra. Entrevistas con artesanos locales, rutas secretas, gastronomía tradicional y agenda cultural.
                            <br /><br />
                            {!magazineSettings.magazineActive || !magazineSettings.magazineUrl ? (
                                <span className="italic text-[#D4AF37]">Próximamente...</span>
                            ) : null}
                        </p>

                        {magazineSettings.magazineActive && magazineSettings.magazineUrl && (
                            <a
                                href={magazineSettings.magazineUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black">
                                    Leer el Periódico
                                </Button>
                            </a>
                        )}

                        {(!magazineSettings.magazineActive || !magazineSettings.magazineUrl) && (
                            <Button variant="secondary" disabled className="bg-white/5 border border-white/10 text-white/50 cursor-not-allowed">
                                Suscribirse
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Internal Carousel Component
const Carousel: React.FC<{ items: any[] }> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [itemWidth, setItemWidth] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                let perView = 3;
                if (width < 768) perView = 1;
                else if (width < 1024) perView = 2;

                setItemsPerView(perView);
                setItemWidth(width / perView);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const displayItems = [...items, ...items];

    useEffect(() => {
        if (isPaused || items.length <= itemsPerView) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused, items.length, itemsPerView, currentIndex]);

    const nextSlide = () => {
        if (currentIndex >= items.length) {
            setIsTransitioning(false);
            setCurrentIndex(0);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true);
                    setCurrentIndex(1);
                });
            });
        } else {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleTransitionEnd = () => {
        if (currentIndex >= items.length) {
            setIsTransitioning(false);
            setCurrentIndex(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className="flex"
                style={{
                    transform: `translateX(-${currentIndex * itemWidth}px)`,
                    width: `${displayItems.length * itemWidth}px`,
                    transition: isTransitioning ? 'transform 700ms ease-in-out' : 'none'
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {displayItems.map((property, idx) => (
                    <div
                        key={`${property.id}-${idx}`}
                        className="flex-shrink-0 px-3"
                        style={{ width: `${itemWidth}px` }}
                    >
                        <PropertyCard property={property} />
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${(currentIndex % items.length) === idx
                            ? 'bg-[var(--color-primary)]'
                            : 'bg-gray-300'
                            }`}
                        onClick={() => {
                            setIsTransitioning(true);
                            setCurrentIndex(idx);
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
