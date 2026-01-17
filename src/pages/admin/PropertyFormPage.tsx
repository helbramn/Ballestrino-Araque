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
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string>('');

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
                setImagePreviews(property.images || []);
                setMainImagePreview(property.mainImage || '');
            }
        } catch (error) {
            console.error('Error loading property:', error);
            alert('Error al cargar la propiedad');
        }
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMainImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setMainImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
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
            const tempId = id || `temp_${Date.now()}`;

            // 1. Handle Main Image
            let mainImageUrl = '';

            // If the preview is an HTTPS URL, reuse it (it was pasted or already existed)
            if (mainImagePreview && mainImagePreview.startsWith('http')) {
                mainImageUrl = mainImagePreview;
            }

            // Only upload if we have a NEW file (and it generates a data URL preview, meaning it's not a remote URL)
            // But mainImageFile is the source of truth for "new file to upload"
            if (mainImageFile) {

                try {
                    const [uploadedUrl] = await timeoutPromise(15000, uploadPropertyImages([mainImageFile], tempId)) as string[];
                    mainImageUrl = uploadedUrl;

                } catch (uploadError) {
                    console.error("Failed to upload main image", uploadError);
                    const msg = uploadError instanceof Error ? uploadError.message : "Error desconocido";
                    // If upload fails, checks if we had a backup URL? No, just fail.
                    // But if user provided a file, they expect upload.
                    alert(`Error CRÍTICO al subir portada: ${msg}. Intenta usar una URL externa.`);
                    setLoading(false);
                    return;
                }
            }

            // 2. Handle Gallery Images
            // Collect existing URLs from previews (that are not data URLs)
            const existingUrls = imagePreviews.filter(url => url.startsWith('http'));

            let uploadedGalleryUrls: string[] = [];

            if (imageFiles.length > 0) {
                console.log("Starting gallery images upload...");
                try {
                    uploadedGalleryUrls = await timeoutPromise(15000, uploadPropertyImages(imageFiles, tempId)) as string[];

                } catch (uploadError) {
                    console.error("Failed to upload gallery images", uploadError);
                    const msg = uploadError instanceof Error ? uploadError.message : "Error desconocido";
                    alert(`Error CRÍTICO al subir galería: ${msg}. Intenta usar URLs externas.`);
                    setLoading(false);
                    return;
                }
            }

            // Combine existing (or pasted) URLs with newly uploaded ones
            // We use Set to allow uniqueness if needed, but array is fine.
            // Note: We need to respect the order if possible, but separating them is easier.
            // If precise order matters (mixed urls and files), we'd need a more complex mapping map,
            // but for now appending is acceptable.
            const finalImageUrls = [...existingUrls, ...uploadedGalleryUrls];

            const propertyData: PropertyFormData = {
                ...formData,
                mainImage: mainImageUrl,
                images: finalImageUrls
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
            console.error('Error saving property FULL:', error);
            // Show the actual error message if available
            const errorMessage = error.message || error.toString();
            alert(`Error al guardar: ${errorMessage}`);
        } finally {
            setLoading(false); // Ensure this is always called
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

                    {/* Imágenes */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
                            Imágenes de la Propiedad
                        </h2>

                        {/* Imagen Principal */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium mb-3">Imagen Principal (Portada)</label>

                            {/* URL Input option */}
                            <div className="mb-4 flex gap-2">
                                <Input
                                    placeholder="🔗 O pega aquí el enlace (URL) de la imagen..."
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        if (url) {
                                            setMainImagePreview(url);
                                            setFormData(prev => ({ ...prev, mainImage: url }));
                                            setMainImageFile(null); // Clear file if URL is used
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex items-start gap-6">
                                {mainImagePreview ? (
                                    <div className="relative group w-64 h-40">
                                        <img
                                            src={mainImagePreview}
                                            alt="Main preview"
                                            className="w-full h-full object-cover rounded-lg border-2 border-[var(--color-primary)] bg-gray-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMainImageFile(null);
                                                setMainImagePreview('');
                                                setFormData(prev => ({ ...prev, mainImage: '' }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded">
                                            Portada
                                        </span>
                                    </div>
                                ) : (
                                    <div className="w-64 h-40 border-2 border-dashed border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Subir Portada</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Galería de Imágenes</label>

                            {/* URL Input for Gallery */}
                            <div className="flex gap-2 mb-4">
                                <Input
                                    id="gallery-url-input"
                                    placeholder="🔗 Pega enlace para galería y pulsa enter..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const input = e.currentTarget as HTMLInputElement;
                                            const url = input.value;
                                            if (url) {
                                                setImagePreviews(prev => [...prev, url]);
                                                // We don't verify if it's a file or string here, just add to previews. 
                                                // In handleSubmit, we'll combine existing strings with new file uploads.
                                                // Wait, formData.images normally holds the final URLs. 
                                                // So we should add it to a tracking state or simple append to formData.images if we were syncing real-time,
                                                // but handleSubmit rebuilds it. 
                                                // Let's ensure handleSubmit respects previews that are already strings (URLs) and not files.
                                                input.value = '';
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        const input = document.getElementById('gallery-url-input') as HTMLInputElement;
                                        if (input && input.value) {
                                            setImagePreviews(prev => [...prev, input.value]);
                                            input.value = '';
                                        }
                                    }}
                                >
                                    Añadir
                                </Button>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-[var(--color-border)] bg-gray-100"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
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

                    {imagePreviews.length === 0 && (
                        <p className="text-sm text-gray-500 mt-4">
                            ℹ️ Modo diagnóstico: Se permite guardar sin imágenes para probar la conexión.
                        </p>
                    )}
                </Card>
            </form>
        </div >
    );
};

// Helper to timeout the upload promise
const timeoutPromise = (ms: number, promise: Promise<any>) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout de carga (${ms}ms) - Posible problema de conexión o permisos con Firebase Storage`));
        }, ms);

        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch((reason) => {
                clearTimeout(timer);
                reject(reason);
            });
    });
};
