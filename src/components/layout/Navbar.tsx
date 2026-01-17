import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Heart } from 'lucide-react';
import { ImageLightbox } from '../ui/ImageLightbox';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const location = useLocation();
    const { favorites } = useFavorites();

    const isActive = (path: string) => location.pathname === path;
    const isHome = location.pathname === '/';

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Propiedades', path: '/propiedades' },
        { name: 'Encargos', path: '/encargos' },
        { name: 'Inversores', path: '/inversores' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${isHome ? 'glass' : 'bg-[#C4A484]/95 backdrop-blur-md shadow-md'}`}>
            <div className="container-custom flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    {/* Image - Opens Lightbox */}
                    <div
                        onClick={() => setIsLightboxOpen(true)}
                        className="cursor-pointer transition-transform hover:scale-110"
                    >
                        <img
                            src="/images/ballestrino-logo.png"
                            alt="Ballestrino-Araque Logo"
                            className="w-16 h-16 object-contain rounded-full shadow-lg bg-white/10 backdrop-blur-sm p-1"
                        />
                    </div>

                    {/* Text - Links to Home */}
                    <Link to="/" className="flex flex-col group">
                        <span className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-wide drop-shadow-md group-hover:opacity-90 transition-opacity">
                            Ballestrino-Araque
                        </span>
                        <span className="text-[10px] lg:text-xs text-white/90 uppercase tracking-[0.2em] font-medium hidden sm:block">
                            Inmobiliaria Singular
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-base font-medium uppercase tracking-wider transition-all duration-300 hover:text-white hover:scale-105 ${isActive(link.path)
                                ? 'text-white border-b-2 border-white pb-1'
                                : 'text-white/80 hover:border-b-2 hover:border-white/50 hover:pb-1'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/favoritos" className="relative group p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        {favorites.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-sm">
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium p-2 rounded-md transition-colors ${isActive(link.path) ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/favoritos"
                            className="text-sm font-medium p-2 rounded-md transition-colors text-[var(--color-text)] flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <Heart className="w-5 h-5 text-red-500" />
                            Mis Favoritos ({favorites.length})
                        </Link>
                    </div>
                )}
            </div>

            {/* Logo Lightbox */}
            <ImageLightbox
                images={['/images/ballestrino-logo.png']}
                isOpen={isLightboxOpen}
                currentIndex={0}
                onClose={() => setIsLightboxOpen(false)}
                onNext={() => { }}
                onPrev={() => { }}
            />
        </nav>
    );
};
