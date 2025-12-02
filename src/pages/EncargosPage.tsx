import React from 'react';
import { EncargoCard } from '../components/inmobiliaria/EncargoCard';
import { encargos } from '../data/encargos';

export const EncargosPage: React.FC = () => {
    return (
        <div className="container-custom py-12 pt-32">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-serif mb-6">Demandas Activas</h1>
                <p className="text-[var(--color-text-light)] text-lg leading-relaxed">
                    Estas son algunas de las propiedades que nuestros clientes están buscando actualmente.
                    <br />
                    <span className="font-medium text-[var(--color-primary)]">¿Tienes una propiedad que encaje?</span> Contáctanos y cerraremos la operación rápidamente.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                {encargos.map(encargo => (
                    <EncargoCard key={encargo.id} encargo={encargo} />
                ))}
            </div>

            <div className="mt-20 bg-[#F5F5F0] rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-[#E5E5E0]">
                <h3 className="text-2xl font-serif mb-4">¿No encuentras tu comprador ideal?</h3>
                <p className="text-[var(--color-text-light)] mb-8 max-w-2xl mx-auto">
                    Nuestra base de datos de inversores y compradores cualificados crece cada día.
                    Publica tu propiedad con nosotros y accede a clientes exclusivos.
                </p>
                {/* Contact button could go here */}
            </div>
        </div>
    );
};
