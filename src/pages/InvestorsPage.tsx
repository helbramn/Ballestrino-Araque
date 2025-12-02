import React from 'react';
import { InvestorForm } from '../components/inmobiliaria/InvestorForm';

export const InvestorsPage: React.FC = () => {
    return (
        <div className="container-custom py-12 pt-32">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
                <div className="space-y-8">
                    <h1 className="text-4xl md:text-5xl">Inversión Inmobiliaria Inteligente</h1>

                    <div className="prose prose-lg text-[var(--color-text-light)]">
                        <p>
                            En Carlota Inmob, ofrecemos un servicio exclusivo para inversores que buscan
                            rentabilidad y seguridad en el mercado inmobiliario rústico.
                        </p>
                        <p>
                            Identificamos propiedades con alto potencial de revalorización, proyectos de
                            rehabilitación y oportunidades off-market que no llegan a los portales tradicionales.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 pt-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-3xl mb-2">💎</div>
                            <h3 className="font-bold mb-1">Off-Market</h3>
                            <p className="text-sm text-gray-500">Acceso a propiedades exclusivas antes de su publicación.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-3xl mb-2">📊</div>
                            <h3 className="font-bold mb-1">Análisis</h3>
                            <p className="text-sm text-gray-500">Estudios de viabilidad y rentabilidad detallados.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-3xl mb-2">🏗️</div>
                            <h3 className="font-bold mb-1">Gestión</h3>
                            <p className="text-sm text-gray-500">Supervisión de reformas y puesta en valor.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-3xl mb-2">🤝</div>
                            <h3 className="font-bold mb-1">Red Local</h3>
                            <p className="text-sm text-gray-500">Contactos directos con propietarios y administración.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:pl-12">
                    <div className="sticky top-24">
                        <InvestorForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
