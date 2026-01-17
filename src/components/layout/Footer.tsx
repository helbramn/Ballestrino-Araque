import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-text)] text-white mt-auto">
            <div className="container-custom section-padding">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link to="/">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src="/images/ballestrino-logo.png"
                                    alt="Ballestrino-Araque Logo"
                                    className="h-16 w-16 object-contain rounded-full bg-white/10"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Ballestrino-Araque</h3>
                                    <p className="text-sm text-gray-400">Inmobiliaria</p>
                                </div>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Especialistas en propiedades singulares. Tu hogar ideal te espera.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Enlaces</h4>
                        <nav className="flex flex-col gap-2">
                            <Link to="/" className="text-sm text-gray-400 transition-colors hover:text-white">
                                Inicio
                            </Link>
                            <Link to="/propiedades" className="text-sm text-gray-400 transition-colors hover:text-white">
                                Propiedades
                            </Link>
                            <Link to="/encargos" className="text-sm text-gray-400 transition-colors hover:text-white">
                                Encargos
                            </Link>
                            <Link to="/inversores" className="text-sm text-gray-400 transition-colors hover:text-white">
                                Inversores
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contacto</h4>
                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=araquecarlota77@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                araquecarlota77@gmail.com
                            </a>
                            <a href="tel:+34722713530" className="hover:text-white transition-colors">
                                +34 722 71 35 30
                            </a>
                            <p className="text-xs text-gray-400">
                                Solo llamadas tardes (18:00 - 20:00)
                            </p>
                            <p className="text-xs text-[var(--color-primary)]">
                                * Preferible contacto por email
                            </p>
                            <p>Segovia, España</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Ballestrino-Araque. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
