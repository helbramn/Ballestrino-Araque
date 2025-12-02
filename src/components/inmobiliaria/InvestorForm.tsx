import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const InvestorForm: React.FC = () => {
    return (
        <form className="space-y-4 bg-[var(--color-background)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <h3 className="text-xl font-bold mb-2">Contactar como Inversor</h3>
            <p className="text-sm text-[var(--color-text-light)] mb-4">
                Recibe oportunidades exclusivas antes de que salgan al mercado.
            </p>

            <Input
                placeholder="Nombre completo"
                className="bg-white"
            />

            <Input
                type="email"
                placeholder="Email corporativo / personal"
                className="bg-white"
            />

            <Input
                type="tel"
                placeholder="Teléfono"
                className="bg-white"
            />

            <Button type="submit" variant="secondary" className="w-full">
                Solicitar Información
            </Button>
        </form>
    );
};
