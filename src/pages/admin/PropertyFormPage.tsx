import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPropertyById, createProperty, updateProperty } from '../../services/propertyService';
import { uploadImageToImgBB } from '../../services/imgbbService';
import type { Property } from '../../types/property';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';

type PropertyFormData = Omit<Property, 'id'>;

export const PropertyFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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
        energyCertificate: 'En proceso',
        highlighted: false,
        mainImage: '',
        images: [],
        features: [],
        location: { lat: 0, lng: 0 }
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
                setMainImageUrl(property.mainImage || '');
                setMainImagePreview(property.mainImage || '');
                setGalleryUrls(property.images || []);
                setGalleryPreviews(property.images || []);
            }
        } catch (error) {
            console.error('Error loading property:', error);
            alert('Error al cargar la propiedad');
        }
    };

    // Handle main image file upload to ImgBB
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingMain(true);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to ImgBB
            const url = await uploadImageToImgBB(file);
            setMainImageUrl(url);
            console.log('Main image uploaded:', url);
        } catch (error) {
            console.error('Error uploading main image:', error);
            alert('Error al subir la imagen principal. Por favor intenta de nuevo.');
            setMainImagePreview('');
        } finally {
            setUploadingMain(false);
        }
    };

    // Handle gallery images upload to ImgBB
    const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            alert('Máximo 5 imágenes para la galería');
            return;
        }

        if (files.length === 0) return;

        try {
            setUploadingGallery(true);

            // Create previews
            const previews: string[] = [];
            for (const file of files) {
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onloadend = () => {
                        previews.push(reader.result as string);
                        resolve(null);
                    };
                    reader.readAsDataURL(file);
                });
            }
            setGalleryPreviews(prev => [...prev, ...previews]);

            // Upload all files to ImgBB
            const uploadPromises = files.map(file => uploadImageToImgBB(file));
            const urls = await Promise.all(uploadPromises);
            setGalleryUrls(prev => [...prev, ...urls]);
            console.log('Gallery images uploaded:', urls);
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            alert('Error al subir imágenes de la galería. Por favor intenta de nuevo.');
        } finally {
            setUploadingGallery(false);
        }
    };

    // Remove image from gallery
    const removeGalleryImage = (index: number) => {
        setGalleryUrls(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Starting save process...");

            const safeNumber = (num: any) => (isNaN(Number(num)) ? 0 : Number(num));

            const propertyData: PropertyFormData = {
                ...formData,
                price: safeNumber(formData.price),
                area: safeNumber(formData.area),
                bedrooms: safeNumber(formData.bedrooms),
                bathrooms: safeNumber(formData.bathrooms),
                location: {
                    lat: safeNumber(formData.location?.lat),
                    lng: safeNumber(formData.location?.lng),
                    address: formData.location?.address || ''
                },
                mainImage: mainImageUrl,
                images: galleryUrls
            };

            if (id) {
                await updateProperty(id, propertyData);
                alert('Propiedad actualizada correctamente');
            } else {
                await createProperty(propertyData);
                alert('Propiedad creada correctamente');
            }

            navigate('/admin');
        } catch (error: any) {
            console.error('Error saving property:', error);
            alert(`Error al guardar: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.title && !id) {
        return <div className="p-8 text-center text-[var(--color-primary)]">Cargando datos...</div>;
    }

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
                                <label className="block text-sm font-medium mb-2">Certificado Energético *</label>
                                <div className="space-y-2">
                                    <Input
                                        value={formData.energyCertificate || ''}
                                        onChange={(e) => setFormData({ ...formData, energyCertificate: e.target.value })}
                                        placeholder="Ej: A, B, En proceso..."
                                        required
                                        className="w-full"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, energyCertificate: 'En proceso' })}
                                            className="text-xs px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                        >
                                            En proceso
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, energyCertificate: 'No tiene actualmente' })}
                                            className="text-xs px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                        >
                                            No tiene actualmente
                                        </button>
                                    </div>
                                </div>
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
                                    value={formData.price === 0 ? '' : formData.price}
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
                                    value={formData.area === 0 ? '' : formData.area}
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
                                    value={formData.bedrooms === 0 ? '' : formData.bedrooms}
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
                                    value={formData.bathrooms === 0 ? '' : formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                    min="0"
                                    placeholder="2"
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Imágenes con ImgBB */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Imágenes
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            ✨ Subida directa y gratuita - Las imágenes se alojan automáticamente en ImgBB
                        </p>

                        {/* Imagen Principal */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Principal *</label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <label className="cursor-pointer block">
                                        <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
                                            <span className="text-sm text-[var(--color-primary)] font-semibold">
                                                {uploadingMain ? 'Subiendo...' : 'Click para subir imagen principal'}
                                            </span>
                                            {uploadingMain && (
                                                <div className="mt-2">
                                                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[var(--color-primary)]" />
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageChange}
                                            className="hidden"
                                            disabled={uploadingMain}
                                        />
                                    </label>
                                </div>
                                {mainImagePreview && (
                                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border bg-gray-200 shrink-0">
                                        <img
                                            src={mainImagePreview}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMainImageUrl('');
                                                setMainImagePreview('');
                                            }}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                            title="Eliminar imagen"
                                        >
                                            <X className="w-3 h-3 text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Galería de Imágenes */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Galería de Imágenes</label>

                            <label className="cursor-pointer block">
                                <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-light)]" />
                                    <span className="text-[var(--color-primary)] font-semibold">
                                        {uploadingGallery ? 'Subiendo imágenes...' : 'Click para seleccionar imágenes'}
                                    </span>
                                    <p className="text-sm text-[var(--color-text-light)] mt-2">
                                        Máximo 5 imágenes
                                    </p>
                                    {uploadingGallery && (
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mt-4 text-[var(--color-primary)]" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryImagesChange}
                                    className="hidden"
                                    disabled={uploadingGallery || galleryUrls.length >= 5}
                                />
                            </label>

                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-[var(--color-border)] bg-gray-100"
                                                referrerPolicy="no-referrer"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ubicación (Mapa) */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Ubicación en el Mapa
                        </h2>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800">
                            ℹ️ Para obtener las coordenadas: Ve a Google Maps, haz clic derecho en la ubicación exacta y copia los números (ej: 41.2345, -3.5678).
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Latitud</label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.location?.lat || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        location: {
                                            ...formData.location,
                                            lat: parseFloat(e.target.value) || 0,
                                            lng: formData.location?.lng || 0
                                        }
                                    })}
                                    placeholder="Ej: 40.4168"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Longitud</label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.location?.lng || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        location: {
                                            ...formData.location,
                                            lat: formData.location?.lat || 0,
                                            lng: parseFloat(e.target.value) || 0
                                        }
                                    })}
                                    placeholder="Ej: -3.7038"
                                />
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

                    {/* Opción VIP */}
                    <div className="mt-4">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-[var(--color-border)] rounded-lg hover:bg-[#D4AF37]/5 transition-colors border-l-4 border-l-transparent hover:border-l-[#D4AF37]">
                            <input
                                type="checkbox"
                                checked={(formData as any).isVIP || false}
                                onChange={(e) => setFormData(prev => ({ ...prev, isVIP: e.target.checked } as any))}
                                className="w-5 h-5 text-[#D4AF37] border-[var(--color-border)] rounded focus:ring-[#D4AF37]"
                            />
                            <div>
                                <span className="font-medium flex items-center gap-2">
                                    Colección Premium / VIP 💎
                                </span>
                                <p className="text-sm text-[var(--color-text-light)]">
                                    La propiedad tendrá un distintivo especial dorado de lujo
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-6 border-t border-[var(--color-border)]">
                        <Button
                            type="submit"
                            disabled={loading}
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
                </Card>
            </form>
        </div>
    );
};

