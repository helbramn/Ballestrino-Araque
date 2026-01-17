import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { createEncargo } from '../../services/encargoService';
import { getProperties } from '../../services/propertyService';
import { getSettings } from '../../services/settingsService';
import { PropertyCard } from './PropertyCard';
import {
    Home, Building, Trees, Store, Key, Banknote, ArrowRight, ArrowLeft, Check,
    Star, Sun, Wind, Waves, SearchX, Percent, Map, Flame, ShoppingBag, Truck, Maximize
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const PropertyFinderWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [dynamicFeatures, setDynamicFeatures] = useState<string[]>([]);

    const [data, setData] = useState({
        operation: '',
        type: '',
        bedrooms: 0,
        bathrooms: 0,
        surfaceMin: 0,
        features: [] as string[],
        additionalNotes: '', // New field for proposals/notes
        priceMax: '',
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const [props, settings] = await Promise.all([
                getProperties(),
                getSettings()
            ]);
            setAllProperties(props);
            if (settings && settings.quizFeatures) {
                setDynamicFeatures(settings.quizFeatures);
            }
        };
        loadData();
    }, []);

    const isLocal = data.type === 'Local';

    const handleNext = () => {
        let nextStep = step + 1;

        if (isLocal) {
            if (step === 2) nextStep = 5;
        }

        if (nextStep === 8) {
            const filtered = allProperties.filter(p => {
                if (data.operation && p.operation !== data.operation) return false;
                if (data.type && p.type !== data.type) return false;

                if (!isLocal) {
                    if (data.bedrooms > 0 && p.bedrooms < data.bedrooms) return false;
                    if (data.bathrooms > 0 && p.bathrooms < data.bathrooms) return false;
                }

                if (data.surfaceMin > 0 && p.area && p.area < data.surfaceMin) return false;
                if (data.priceMax && p.price > Number(data.priceMax)) return false;

                // Feature matching (Must have ALL selected features)
                if (data.features.length > 0) {
                    const pFeatures = p.features || [];
                    const hasAllFeatures = data.features.every((f: string) => pFeatures.includes(f));
                    if (!hasAllFeatures) return false;
                }

                return true;
            });
            setMatches(filtered);
        }
        setStep(nextStep);
    };

    const handleBack = () => {
        let prevStep = step - 1;
        if (isLocal) {
            if (prevStep === 4) prevStep = 2;
        }
        setStep(prevStep);
    };

    const toggleFeature = (feature: string) => {
        setData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let details = '';
            if (isLocal) {
                details = `Local comercial. Superficie mín: ${data.surfaceMin}m².`;
            } else {
                details = `${data.type}. Hab: ${data.bedrooms}+, Baños: ${data.bathrooms}+, Superficie mín: ${data.surfaceMin}m².`;
            }

            // Include additional notes in description
            const description = `[Quiz Avanzado] Busco: ${details}
            Operación: ${data.operation}.
            Características: ${data.features.join(', ')}. 
            Propuestas/Notas: ${data.additionalNotes || 'Ninguna'}.
            Presupuesto máx: ${data.priceMax}€.`;

            await createEncargo({
                name: data.name,
                email: data.email,
                phone: data.phone,
                operation: data.operation as any,
                type: data.type,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                priceMax: Number(data.priceMax),
                description: description,
                published: false
            });

            if (matches.length > 0) {
                navigate(`/propiedad/${matches[0].id}`);
            } else {
                alert('¡Gracias! Hemos guardado tu búsqueda. Te avisaremos cuando tengamos algo.');
                navigate('/');
            }

        } catch (error) {
            console.error('Error sending quiz encargo:', error);
            alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const totalSteps = 8;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative min-h-[600px] flex flex-col w-full max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="bg-gray-100 h-2 w-full">
                <div
                    className="bg-[var(--color-primary)] h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-8 md:p-12 flex-1 flex flex-col">
                {/* Step 1: Operation */}
                {step === 1 && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">¿Cuál es tu objetivo?</h3>
                        <p className="text-center text-gray-500 mb-10">Selecciona el tipo de operación</p>

                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                            <button
                                onClick={() => { setData({ ...data, operation: 'venta' }); handleNext(); }}
                                className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-center"
                            >
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Key className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold mb-2">Comprar</h4>
                            </button>

                            <button
                                onClick={() => { setData({ ...data, operation: 'alquiler' }); handleNext(); }}
                                className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-center"
                            >
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Banknote className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold mb-2">Alquilar</h4>
                            </button>

                            <button
                                onClick={() => { setData({ ...data, operation: 'opcion_compra' }); handleNext(); }}
                                className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-center"
                            >
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Percent className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold mb-2">Opción a Compra</h4>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Type */}
                {step === 2 && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">¿Qué buscas?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto w-full mt-8">
                            {[
                                { id: 'Casa', icon: Home, label: 'Casa / Chalet' },
                                { id: 'Piso', icon: Building, label: 'Piso' },
                                { id: 'Finca', icon: Trees, label: 'Finca Singular' },
                                { id: 'Local', icon: Store, label: 'Local / Negocio' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setData({ ...data, type: item.id }); handleNext(); }}
                                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${data.type === item.id
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                                        : 'border-gray-100 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <item.icon className="w-8 h-8" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Bedrooms (Only if NOT Local) */}
                {step === 3 && !isLocal && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">¿Cuántas habitaciones?</h3>
                        <div className="flex justify-center gap-4 mt-8">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => { setData({ ...data, bedrooms: num }); handleNext(); }}
                                    className={`w-16 h-16 rounded-full border-2 text-xl font-bold transition-all ${data.bedrooms === num
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                        : 'border-gray-200 hover:border-[var(--color-primary)] text-gray-600'
                                        }`}
                                >
                                    {num}+
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Bathrooms (Only if NOT Local) */}
                {step === 4 && !isLocal && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">¿Cuántos baños?</h3>
                        <div className="flex justify-center gap-4 mt-8">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => { setData({ ...data, bathrooms: num }); handleNext(); }}
                                    className={`w-16 h-16 rounded-full border-2 text-xl font-bold transition-all ${data.bathrooms === num
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                        : 'border-gray-200 hover:border-[var(--color-primary)] text-gray-600'
                                        }`}
                                >
                                    {num}+
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Surface/Size (For EVERYONE) */}
                {step === 5 && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">¿Necesitas que sea muy amplio?</h3>
                        <p className="text-center text-gray-500 mb-10">Selecciona superficie mínima (m²)</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
                            {[0, 50, 80, 100, 150, 200, 300, 500].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => { setData({ ...data, surfaceMin: size }); handleNext(); }}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${data.surfaceMin === size
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                        : 'border-gray-100 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <Maximize className="w-5 h-5" />
                                    <span className="font-bold text-lg">{size === 0 ? 'Indiferente' : `${size} m²+`}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 6: Features (Dynamic) + Proposals */}
                {step === 6 && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">Imprescindibles</h3>
                        <p className="text-center text-gray-500 mb-10">Selecciona lo que no puede faltar</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full mb-8">
                            {/* Static + Dynamic Features List */}
                            {(() => {
                                const staticFeatures = isLocal ? [
                                    { id: 'Salida de humos', icon: Flame },
                                    { id: 'Escaparate', icon: ShoppingBag },
                                    { id: 'A pie de calle', icon: Map },
                                    { id: 'Almacén', icon: Truck },
                                    { id: 'Reformado', icon: Star },
                                    { id: 'Diáfano', icon: Maximize },
                                ] : [
                                    { id: 'Jardín', icon: Trees },
                                    { id: 'Piscina', icon: Waves },
                                    { id: 'Vistas', icon: Sun },
                                    { id: 'Chimenea', icon: Wind },
                                    { id: 'Garaje', icon: Home },
                                    { id: 'Reformado', icon: Star },
                                    { id: 'Terraza', icon: Sun },
                                    { id: 'Trastero', icon: Building },
                                    { id: 'Jacuzzi', icon: Waves },
                                ];

                                // Map dynamic strings to objects with default icon
                                const dynamicObjs = dynamicFeatures.map(f => ({ id: f, icon: Star }));

                                // Combine and dedup by id
                                const all = [...staticFeatures, ...dynamicObjs];
                                const seen = new Set();
                                return all.filter(item => {
                                    const duplicate = seen.has(item.id);
                                    seen.add(item.id);
                                    return !duplicate;
                                });
                            })().map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => toggleFeature(item.id)}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${data.features.includes(item.id)
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                                        : 'border-gray-100 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${data.features.includes(item.id) ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm">{item.id}</span>
                                </button>
                            ))}
                        </div>

                        {/* Additional Proposals/Notes */}
                        <div className="max-w-2xl mx-auto w-full mb-8">
                            <label className="block text-sm font-medium mb-2 text-gray-600">¿Tienes alguna otra preferencia o propuesta? (Opcional)</label>
                            <textarea
                                value={data.additionalNotes}
                                onChange={(e) => setData({ ...data, additionalNotes: e.target.value })}
                                placeholder="Ej: Me gustaría que tenga sol de mañana, o busco una zona muy tranquila..."
                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[var(--color-primary)] focus:outline-none min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="text-center">
                            <Button onClick={handleNext} size="lg" className="px-12">
                                Continuar <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 7: Budget */}
                {step === 7 && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif text-center mb-2">Presupuesto Máximo</h3>
                        <div className="max-w-md mx-auto w-full space-y-8 mt-8">
                            <div className="relative">
                                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                                <Input
                                    type="number"
                                    value={data.priceMax}
                                    onChange={(e) => setData({ ...data, priceMax: e.target.value })}
                                    placeholder="Ej: 250000"
                                    className="pl-12 text-2xl py-6 font-serif"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleNext}
                                    size="lg"
                                    className="px-12"
                                    disabled={!data.priceMax}
                                >
                                    Ver Resultados <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 8: Contact & Results (Final) */}
                {step === 8 && (
                    <div className="animate-fade-in flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
                        {matches.length > 0 ? (
                            <div className="mb-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold">¡Hemos encontrado {matches.length} inmuebles para ti!</h3>

                                    {/* Detailed Metrics */}
                                    <div className="bg-blue-50 p-4 rounded-xl mt-4 max-w-lg mx-auto border border-blue-100 flex gap-4 justify-center text-sm text-blue-800">
                                        <div>
                                            <span className="font-bold block text-lg">{matches.length}</span>
                                            Coincidencias
                                        </div>
                                        <div className="w-px bg-blue-200"></div>
                                        <div>
                                            <span className="font-bold block text-lg">
                                                {Math.round(matches.reduce((acc, curr) => acc + curr.price, 0) / matches.length / 1000)}k €
                                            </span>
                                            Precio Medio
                                        </div>
                                        {matches.some(m => m.area) && (
                                            <>
                                                <div className="w-px bg-blue-200"></div>
                                                <div>
                                                    <span className="font-bold block text-lg">
                                                        {Math.round(matches.reduce((acc, curr) => acc + (curr.area || 0), 0) / matches.length)} m²
                                                    </span>
                                                    Superficie Media
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-gray-500 mt-4">
                                        Aquí tienes las propiedades que mejor encajan con tu búsqueda.
                                        Déjanos tus datos para agendar una visita prioritaria.
                                    </p>
                                </div>

                                {/* Results Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                                    {matches.slice(0, 4).map(property => (
                                        <div key={property.id} className="transform scale-90 origin-top">
                                            <PropertyCard property={property} />
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ) : (
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <SearchX className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold">No hay coincidencias exactas</h3>
                                <p className="text-gray-500">
                                    No hemos encontrado inmuebles que cumplan 100% tus requisitos actuales.
                                    <br />
                                    Pero déjanos tus datos y te avisaremos en cuanto entre algo similar.
                                </p>
                                <div className="mt-4">
                                    <Link to="/propiedades" className="text-[var(--color-primary)] underline font-medium">
                                        Ver todas las propiedades sin filtrar
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            {/* Feedback for Additional Notes */}
                            {data.additionalNotes && (
                                <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                                    <div className="text-2xl">📍</div>
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-bold mb-1">Nota sobre tu búsqueda:</p>
                                        <p>
                                            Hemos buscado propiedades con las características marcadas (
                                            {data.features.length > 0 ? data.features.join(', ') : 'ninguna seleccionada'}
                                            ).
                                        </p>
                                        <p className="mt-2">
                                            ⚠️ <strong>"{data.additionalNotes}"</strong>: No podemos filtrar automáticamente por este criterio todavía.
                                            Por favor, <strong>guarda tu alerta abajo</strong> para que un agente revise esto manualmente.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {matches.length > 0 ? (
                                <div className="text-center mb-10">
                                    <h4 className="text-xl font-bold mb-4">¿Quieres ver más detalles?</h4>
                                    <p className="text-gray-600 mb-6">
                                        Accede al catálogo completo filtrado con tus preferencias para ver todas las fotos y detalles.
                                    </p>
                                    <Link
                                        to={`/propiedades?operation=${data.operation}&type=${data.type}&features=${data.features.join(',')}`}
                                        className="inline-flex items-center justify-center px-8 py-4 text-white bg-[var(--color-primary)] rounded-xl font-bold hover:opacity-90 transition-all"
                                    >
                                        Ver todas las recomendaciones <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>

                                    <div className="mt-8 border-t border-gray-100 pt-8">
                                        <p className="font-bold text-gray-800 mb-2">¿No es exactamente lo que buscas?</p>
                                        <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
                                            {data.additionalNotes
                                                ? "Guarda tu alerta abajo para que revisemos tus notas específicas (como 'Futbolín') manualmente."
                                                : "Si quieres que te avisemos de novedades o tienes requisitos especiales, guarda tu alerta aquí."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center mb-8">
                                    <h4 className="text-xl font-bold mb-4 text-center">
                                        Activa tu Alerta de Búsqueda
                                    </h4>
                                </div>
                            )}

                            {/* Alert Form - ALWAYS VISIBLE */}
                            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre</label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        required
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                        required
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Teléfono (Opcional)</label>
                                    <Input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                                        placeholder="Tu teléfono (opcional)"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full py-6 text-lg mt-4"
                                    disabled={loading}
                                >
                                    {loading ? 'Procesando...' : 'Guardar Alerta Personalizada'}
                                </Button>
                            </form>

                            {matches.length > 0 && (
                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="text-gray-400 hover:text-gray-600 text-sm"
                                    >
                                        Volver al Inicio sin guardar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons (Back) */}
                {step > 1 && step < 8 && (
                    <div className="mt-8 flex justify-start">
                        <button
                            onClick={handleBack}
                            className="text-gray-400 hover:text-gray-600 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
