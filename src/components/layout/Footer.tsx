import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-text)] text-white mt-auto">
            <div className="container-custom section-padding">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] font-serif text-lg font-bold">
                                CI
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Carlota Inmob</h3>
                                <p className="text-sm text-gray-400">Inmobiliaria Rústica</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">
                            Especialistas en propiedades rústicas en la sierra de Segovia. Tu hogar en el campo te espera.
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
                            <p>info@carlotainmob.com</p>
                            <p>+34 921 000 000</p>
                            <p>Segovia, España</p>
                            <p className="mt-2 text-xs">Lunes a Viernes: 9:00 - 18:00</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Carlota Inmob. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
