import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const EncargoForm: React.FC = () => {
    const [formData, setFormData] = useState({
        operation: 'compra',
        zone: '',
        budget: '',
        description: '',
        email: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        alert('¡Encargo recibido! Nos pondremos en contacto contigo pronto.');
        // Reset form or redirect
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-[var(--color-border)]">
            <h3 className="text-xl font-bold mb-4">Publicar nuevo encargo</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <Select
                    label="Operación"
                    name="operation"
                    value={formData.operation}
                    onChange={handleChange}
                    options={[
                        { value: 'compra', label: 'Comprar' },
                        { value: 'alquiler', label: 'Alquilar' },
                        { value: 'opcion_compra', label: 'Opción a Compra' }
                    ]}
                />

                <Input
                    label="Zona preferida"
                    name="zone"
                    placeholder="Ej: Pedraza, La Granja..."
                    value={formData.zone}
                    onChange={handleChange}
                    required
                />
            </div>

            <Input
                label="Presupuesto máximo (€)"
                name="budget"
                type="number"
                placeholder="Ej: 300000"
                value={formData.budget}
                onChange={handleChange}
                required
            />

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Certificado Energético (Opcional)
                </label>
                <div className="space-y-2">
                    <Input
                        name="energyCertificate"
                        placeholder="Ej: A, B, En proceso..."
                        value={(formData as any).energyCertificate || ''}
                        onChange={handleChange}
                    />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, energyCertificate: 'En proceso' } as any))}
                            className="text-xs px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        >
                            En proceso
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, energyCertificate: 'No tiene actualmente' } as any))}
                            className="text-xs px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        >
                            No tiene actualmente
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Descripción detallada
                </label>
                <textarea
                    name="description"
                    rows={4}
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="Cuéntanos qué buscas: nº habitaciones, jardín, estilo..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <Input
                label="Tu Email de contacto"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <Button type="submit" className="w-full">
                Enviar Encargo
            </Button>
        </form >
    );
};
