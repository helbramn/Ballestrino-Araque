import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PropertyCard } from '../components/inmobiliaria/PropertyCard';
import { AdvisoryCardStack } from '../components/inmobiliaria/AdvisoryCardStack';
import { properties } from '../data/properties';

export const HomePage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    // Randomly shuffle and select 6 properties on first render
    const [randomProperties] = React.useState(() => {
        const highlighted = properties.filter(p => p.highlighted);
        return highlighted.sort(() => Math.random() - 0.5).slice(0, 6);
    });

    // Auto-rotate every 6 seconds using modulo for true infinite loop
    React.useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % randomProperties.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isPaused, randomProperties.length]);

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-[var(--color-background)] to-white pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text */}
                        <div className="text-center lg:text-left space-y-8">
                            <Badge variant="accent" className="mb-4">Inmobiliaria Boutique</Badge>

                            <h1 className="text-balance text-4xl lg:text-6xl font-serif leading-tight">
                                Tu hogar en el campo <span className="text-[var(--color-primary)]">te espera</span>
                            </h1>

                            <p className="text-lg text-[var(--color-text-light)] text-balance leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Descubre propiedades singulares en la sierra de Segovia.
                                Tradición, naturaleza y confort en perfecta armonía.
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

            {/* Featured Properties */}
            <section className="container-custom">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="mb-2">Propiedades Destacadas</h2>
                        <p className="text-[var(--color-text-light)]">Selección exclusiva de nuestros mejores inmuebles</p>
                    </div>
                    <Link to="/propiedades" className="hidden md:block">
                        <Button variant="secondary" size="sm">Ver todas</Button>
                    </Link>
                </div>

                {/* Responsive Infinite Carousel */}
                <div
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Responsive: 1 card on mobile, 2 on tablet, 3 on desktop */}
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {/* Triple rendering for seamless infinite loop */}
                        {[...randomProperties, ...randomProperties, ...randomProperties].map((property, idx) => (
                            <div
                                key={`${property.id}-${idx}`}
                                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
                            >
                                <PropertyCard property={property} />
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
};
