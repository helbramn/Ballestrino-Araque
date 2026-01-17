import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const InvestorForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct email body
        const subject = encodeURIComponent(`SOLICITUD INVERSOR: ${formData.name}`);
        const body = encodeURIComponent(
            `SOLICITUD DE INFORMACIÓN PARA INVERSORES

DATOS DEL INTERESADO:
--------------------------------
Nombre: ${formData.name}
Email: ${formData.email}
Teléfono: ${formData.phone}

Fecha: ${new Date().toLocaleDateString()}
--------------------------------

Estoy interesado en recibir información sobre oportunidades de inversión, activos off-market y proyectos de rentabilidad.
`);

        // Open Gmail in new tab
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=araquecarlota77@gmail.com&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-background)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">Contactar como Inversor</h3>
                <a href="tel:+34722713530" className="text-sm text-[var(--color-primary)] hover:underline font-medium">
                    Llamar ahora
                </a>
            </div>
            <p className="text-sm text-[var(--color-text-light)] mb-4">
                Recibe oportunidades exclusivas antes de que salgan al mercado.
            </p>

            <Input
                placeholder="Nombre completo"
                className="bg-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <Input
                type="email"
                placeholder="Email corporativo / personal"
                className="bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />

            <Input
                type="tel"
                placeholder="Teléfono"
                className="bg-white"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
            />

            <Button type="submit" variant="secondary" className="w-full">
                Solicitar Información
            </Button>
        </form>
    );
};
