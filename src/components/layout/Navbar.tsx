import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Propiedades', path: '/propiedades' },
        { name: 'Encargos', path: '/encargos' },
        { name: 'Inversores', path: '/inversores' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#C4A484]/85 backdrop-blur-md shadow-md py-4`}>
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-serif font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white text-sm">CI</div>
                    <span className="text-white">Carlota Inmob</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-white ${isActive(link.path)
                                ? 'text-white font-bold border-b-2 border-white'
                                : 'text-white/90'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
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
                    </div>
                )}
            </div>
        </nav>
    );
};
