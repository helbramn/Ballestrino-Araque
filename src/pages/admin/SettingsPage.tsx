import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings, type AppSettings } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Save, ExternalLink, Loader2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<AppSettings>({
        magazineUrl: '',
        magazineActive: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            setFormData(data);
        } catch (error) {
            console.error('Error loading settings:', error);
            alert('Error al cargar la configuración');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSettings(formData);
            alert('Configuración guardada correctamente ✅');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)]">
                Configuración General
            </h1>

            <form onSubmit={handleSubmit}>
                <Card className="p-8 space-y-8">
                    {/* Magazine Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                                <span className="text-2xl">📰</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                                    Periódico del Pueblo
                                </h2>
                                <p className="text-sm text-[var(--color-text-light)]">
                                    Gestiona el enlace que aparece en la sección "Lifestyle & Cultura" de la portada.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Toggle Active */}
                            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.magazineActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, magazineActive: e.target.checked }))}
                                    className="w-5 h-5 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
                                />
                                <div>
                                    <span className="font-medium">Mostrar Botón "Leer Periódico"</span>
                                    <p className="text-sm text-[var(--color-text-light)]">
                                        Si está desactivado, se mostrará "Próximamente..."
                                    </p>
                                </div>
                            </label>

                            {/* URL Input */}
                            <div className={`transition-opacity duration-300 ${formData.magazineActive ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                <label className="block text-sm font-medium mb-2">
                                    Enlace al Periódico (URL)
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="https://ejemplo.com/periodico-semana-12.pdf"
                                        value={formData.magazineUrl || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, magazineUrl: e.target.value }))}
                                        disabled={!formData.magazineActive}
                                        className="w-full"
                                    />
                                    {formData.magazineUrl && (
                                        <a
                                            href={formData.magazineUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                            title="Probar enlace"
                                        >
                                            <ExternalLink className="w-5 h-5 text-gray-600" />
                                        </a>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--color-text-light)] mt-2">
                                    Puedes pegar un enlace a un PDF (Google Drive/Dropbox) o a una página web externa.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 min-w-[150px] justify-center"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Quiz Features Section */}
                <Card className="p-8 space-y-8 mt-6">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                                    Filtros Personalizados del Quiz
                                </h2>
                                <p className="text-sm text-[var(--color-text-light)]">
                                    Añade nuevas opciones (ej: "Futbolín", "Pista de Padel") para que los clientes puedan marcarlas en el paso "Imprescindibles".
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nueva característica (ej: Jacuzzi Interior)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = e.currentTarget.value.trim();
                                            if (val && !formData.quizFeatures?.includes(val)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    quizFeatures: [...(prev.quizFeatures || []), val]
                                                }));
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                                <Button type="button" variant="secondary" onClick={() => {
                                    // Trigger Enter logic manually or use state if refactoring needed
                                    // For simplicity in this edit, relying on Enter for now or adding simple ref logic
                                    alert("Pulsa Enter en la caja de texto para añadir");
                                }}>
                                    Añadir con Enter
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {formData.quizFeatures?.map((feature, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                quizFeatures: prev.quizFeatures?.filter(f => f !== feature)
                                            }))}
                                            className="text-gray-400 hover:text-red-500 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {(!formData.quizFeatures || formData.quizFeatures.length === 0) && (
                                    <span className="text-sm text-gray-400 italic">No hay filtros personalizados aún.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 min-w-[150px] justify-center"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};
