import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPropertyById, createProperty, updateProperty, uploadPropertyImages } from '../../services/propertyService';
import type { Property } from '../../types/property';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

type PropertyFormData = Omit<Property, 'id'>;

export const PropertyFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        description: '',
        price: 0,
        zone: '',
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        type: 'Casa',
        operation: 'venta',
        highlighted: false,
        mainImage: '',
        images: []
    });

    useEffect(() => {
        if (id) {
            loadProperty(id);
        }
    }, [id]);

    const loadProperty = async (propertyId: string) => {
        try {
            const property = await getPropertyById(propertyId);
            if (property) {
                const { id: _, ...propertyData } = property;
                setFormData(propertyData);
                setImagePreviews(property.images || []);
            }
        } catch (error) {
            console.error('Error loading property:', error);
            alert('Error al cargar la propiedad');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentImageCount = (formData.images?.length || 0) + imagePreviews.length;

        if (files.length + currentImageCount > 5) {
            alert('Máximo 5 imágenes por propiedad');
            return;
        }

        setImageFiles(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrls = formData.images || [];

            // Upload new images if any
            if (imageFiles.length > 0) {
                const tempId = id || `temp_${Date.now()}`;
                const uploadedUrls = await uploadPropertyImages(imageFiles, tempId);
                imageUrls = [...imageUrls, ...uploadedUrls];
            }

            const propertyData: PropertyFormData = {
                ...formData,
                mainImage: imageUrls[0] || formData.mainImage || '',
                images: imageUrls
            };

            if (id) {
                await updateProperty(id, propertyData);
                alert('Propiedad actualizada correctamente');
            } else {
                const newId = await createProperty(propertyData);
                alert('Propiedad creada correctamente');
            }

            navigate('/admin');
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Error al guardar la propiedad. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin">
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                </Link>
                <h1 className="text-3xl font-serif font-bold">
                    {id ? 'Editar Propiedad' : 'Nueva Propiedad'}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-8 space-y-8">
                    {/* Información Básica */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Información Básica
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Título de la Propiedad *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej: Casa de pueblo en Sepúlveda"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe la propiedad, sus características, ubicación, etc."
                                    required
                                />
                                <p className="text-xs text-[var(--color-text-light)] mt-1">
                                    Escribe 2-3 frases destacando lo más importante
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Detalles de la Propiedad
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tipo *</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="Casa">Casa</option>
                                    <option value="Apartamento">Apartamento</option>
                                    <option value="Casa Rural">Casa Rural</option>
                                    <option value="Chalet">Chalet</option>
                                    <option value="Terreno">Terreno</option>
                                    <option value="Local Comercial">Local Comercial</option>
                                    <option value="Finca">Finca</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Operación *</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    value={formData.operation}
                                    onChange={(e) => setFormData({ ...formData, operation: e.target.value as Property['operation'] })}
                                    required
                                >
                                    <option value="venta">Venta</option>
                                    <option value="alquiler">Alquiler</option>
                                    <option value="opcion_compra">Alquiler con Opción a Compra</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Zona *</label>
                                <Input
                                    value={formData.zone}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    placeholder="Ej: Sepúlveda"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Precio (€) *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    min="0"
                                    placeholder="250000"
                                    required
                                    className="w-full"
                                />
                                <p className="text-xs text-[var(--color-text-light)] mt-1">
                                    {formData.operation.includes('alquiler') ? 'Precio mensual' : 'Precio total'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Superficie (m²) *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                                    min="0"
                                    placeholder="150"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Habitaciones *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                                    min="0"
                                    placeholder="3"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Baños *</label>
                                <Input
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                    min="0"
                                    placeholder="2"
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Imágenes */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Imágenes de la Propiedad
                        </h2>

                        <div className="space-y-4">
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-[var(--color-border)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-2 left-2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded">
                                                    Principal
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-light)]" />
                                <label className="cursor-pointer">
                                    <span className="text-[var(--color-primary)] font-semibold hover:underline">
                                        Click para seleccionar imágenes
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-[var(--color-text-light)] mt-2">
                                    Máximo 5 imágenes. La primera será la imagen principal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Opciones */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Opciones
                        </h2>
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.highlighted}
                                onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                                className="w-5 h-5 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
                            />
                            <div>
                                <span className="font-medium">Propiedad Destacada</span>
                                <p className="text-sm text-[var(--color-text-light)]">
                                    La propiedad aparecerá en el carrusel de la página de inicio
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-6 border-t border-[var(--color-border)]">
                        <Button
                            type="submit"
                            disabled={loading || imagePreviews.length === 0}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Guardando...' : 'Guardar Propiedad'}
                        </Button>
                        <Link to="/admin">
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </Link>
                    </div>

                    {imagePreviews.length === 0 && (
                        <p className="text-sm text-amber-600">
                            ⚠️ Debes añadir al menos una imagen para guardar la propiedad
                        </p>
                    )}
                </Card>
            </form>
        </div>
    );
};
