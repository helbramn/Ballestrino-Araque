import React, { useState, useEffect } from 'react';
import { EncargoCard } from '../components/inmobiliaria/EncargoCard';
import { getPublishedEncargos, createEncargo } from '../services/encargoService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { Encargo } from '../types/encargo';
import { ClipboardList, Search, Home, Banknote, MapPin } from 'lucide-react';
import { SEOHeaders } from '../components/seo/SEOHeaders';

export const EncargosPage: React.FC = () => {
    const [publishedEncargos, setPublishedEncargos] = useState<Encargo[]>([]);
    const [loadingEncargos, setLoadingEncargos] = useState(true);
    const [formData, setFormData] = useState<Omit<Encargo, 'id' | 'createdAt'>>({
        name: '',
        email: '',
        phone: '',
        operation: 'venta',
        type: '',
        priceMin: undefined,
        priceMax: undefined,
        zone: '',
        bedrooms: undefined,
        bathrooms: undefined,
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadEncargos = async () => {
            try {
                const data = await getPublishedEncargos();
                setPublishedEncargos(data);
            } catch (error) {
                console.error('Error loading published encargos:', error);
            } finally {
                setLoadingEncargos(false);
            }
        };
        loadEncargos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEncargo(formData);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                operation: 'venta',
                type: '',
                priceMin: undefined,
                priceMax: undefined,
                zone: '',
                bedrooms: undefined,
                bathrooms: undefined,
                description: ''
            });
            setTimeout(() => setSuccess(false), 10000);
        } catch (error) {
            console.error('Error creating encargo:', error);
            alert('Error al enviar el encargo. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-12 pt-32">
            <SEOHeaders title="Demandas Activas y Encargos" description="Propiedades que nuestros clientes buscan activamente. ¡Déjanos tu encargo!" />
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-serif mb-6">Demandas Activas</h1>
                <p className="text-[var(--color-text-light)] text-lg leading-relaxed">
                    Estas son algunas de las propiedades que nuestros clientes están buscando actualmente.
                    <br />
                    <span className="font-medium text-[var(--color-primary)]">¿Tienes una propiedad que encaje?</span> Contáctanos y cerraremos la operación rápidamente.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto mb-20">
                {loadingEncargos ? (
                    <div className="col-span-2 text-center py-12 text-[var(--color-text-light)]">
                        Cargando demandas activas...
                    </div>
                ) : publishedEncargos.length > 0 ? (
                    publishedEncargos.map(encargo => (
                        <EncargoCard key={encargo.id} encargo={encargo} />
                    ))
                ) : (
                    <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-[var(--color-text-light)]">
                            No hay demandas públicas activas en este momento.
                            <br />
                            ¡Sé el primero en enviarnos tu encargo!
                        </p>
                    </div>
                )}
            </div>

            <div className="text-center mb-16 bg-[var(--color-primary)]/5 p-8 rounded-2xl border border-[var(--color-primary)]/10">
                <p className="text-xl font-serif text-[var(--color-primary)] font-medium">
                    "Si te interesa algún encargo u oferta, contáctanos y te ayudamos"
                </p>
                <div className="mt-4 flex justify-center gap-4">
                    <div className="flex flex-col items-center">
                        <Button onClick={() => window.location.href = 'tel:+34722713530'}>
                            Llamar Ahora
                        </Button>
                        <span className="text-sm text-gray-500 mt-2 font-medium">Horario: 18:00 - 20:00</span>
                    </div>

                </div>
            </div>

            {/* Buzón de Encargos */}
            <div className="bg-[#F5F5F0] rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-[#E5E5E0] shadow-lg">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)]/10 rounded-full mb-6 text-[var(--color-primary)]">
                        <ClipboardList className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-serif mb-4">Buzón de Encargos</h3>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
                        ¿No encuentras lo que buscas? Rellena este formulario con los detalles de tu propiedad ideal.
                        Nuestro equipo activará una búsqueda personalizada en nuestra red privada.
                    </p>
                </div>

                {success ? (
                    <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center border border-green-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-2xl font-serif font-bold mb-2">¡Encargo Recibido!</h4>
                        <p className="text-lg">
                            Hemos registrado tu solicitud correctamente.
                            <br />
                            Nos pondremos en contacto contigo en cuanto encontremos opciones que encajen.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Datos de Contacto */}
                        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-[var(--color-primary)]" />
                                Tus Datos de Contacto
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Teléfono *</label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        placeholder="Tu teléfono"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detalles de la Búsqueda */}
                        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Home className="w-5 h-5 text-[var(--color-primary)]" />
                                ¿Qué estás buscando?
                            </h4>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tipo de Operación *</label>
                                    <select
                                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 bg-white"
                                        value={formData.operation}
                                        onChange={(e) => setFormData({ ...formData, operation: e.target.value as any })}
                                    >
                                        <option value="venta">Comprar</option>
                                        <option value="alquiler">Alquilar</option>
                                        <option value="opcion_compra">Alquiler con opción a compra</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tipo de Propiedad</label>
                                    <select
                                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 bg-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="">Cualquiera</option>
                                        <option value="Casa">Casa / Chalet</option>
                                        <option value="Piso">Piso / Apartamento</option>
                                        <option value="Finca">Finca Singular</option>
                                        <option value="Terreno">Terreno / Parcela</option>
                                        <option value="Local">Local Comercial</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Presupuesto Mínimo (€)</label>
                                    <div className="relative">
                                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            value={formData.priceMin || ''}
                                            onChange={(e) => setFormData({ ...formData, priceMin: e.target.value ? Number(e.target.value) : undefined })}
                                            placeholder="Mínimo"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Presupuesto Máximo (€)</label>
                                    <div className="relative">
                                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            value={formData.priceMax || ''}
                                            onChange={(e) => setFormData({ ...formData, priceMax: e.target.value ? Number(e.target.value) : undefined })}
                                            placeholder="Máximo"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Zona Preferente</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={formData.zone || ''}
                                        onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                        placeholder="Ej: Segovia centro, La Granja, Torrecaballeros..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Habitaciones (Mín)</label>
                                    <Input
                                        type="number"
                                        value={formData.bedrooms || ''}
                                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value ? Number(e.target.value) : undefined })}
                                        placeholder="Ej: 3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Baños (Mín)</label>
                                    <Input
                                        type="number"
                                        value={formData.bathrooms || ''}
                                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value ? Number(e.target.value) : undefined })}
                                        placeholder="Ej: 2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Comentarios Adicionales</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                placeholder="Cuéntanos más detalles: jardín imprescindible, garaje, orientación sur, etc."
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none bg-white"
                            />
                        </div>

                        <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                            {loading ? 'Enviando Solicitud...' : 'Enviar Encargo'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};
