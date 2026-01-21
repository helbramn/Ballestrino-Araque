import { useEffect, useState } from 'react';
import { getEncargos, deleteEncargo, updateEncargo, seedEncargos, deleteAllEncargos, createEncargo } from '../../services/encargoService';
import type { Encargo } from '../../types/encargo';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Trash2, Phone, Mail, MapPin, Calendar, Euro, Eye, EyeOff, Plus, Save, X } from 'lucide-react';

export const AdminEncargosList = () => {
    const [encargos, setEncargos] = useState<Encargo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newEncargo, setNewEncargo] = useState<Partial<Encargo>>({
        name: '',
        phone: '',
        email: '',
        description: '',
        operation: 'venta',
        type: 'Casa'
    });

    const loadEncargos = async () => {
        try {
            setLoading(true);
            const data = await getEncargos();
            setEncargos(data);
        } catch (error) {
            console.error('Error loading encargos:', error);
            alert('Error al cargar los encargos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEncargos();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEncargo(newEncargo as any);
            alert('Encargo creado correctamente');
            setShowCreate(false);
            setNewEncargo({ name: '', phone: '', email: '', description: '', operation: 'venta', type: 'Casa' });
            loadEncargos();
        } catch (error) {
            console.error('Error creating encargo:', error);
            alert('Error al crear el encargo');
        }
    };

    const handleTogglePublish = async (encargo: Encargo) => {
        if (!encargo.id) return;

        try {
            await updateEncargo(encargo.id, { published: !encargo.published });
            await loadEncargos();
        } catch (error) {
            console.error('Error updating encargo:', error);
            alert('Error al actualizar el estado del encargo');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar el encargo de "${name}"?\nEsta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await deleteEncargo(id);
            await loadEncargos();
            alert('Encargo eliminado correctamente');
        } catch (error: any) {
            console.error('Error deleting encargo:', error);
            alert(`Error al eliminar el encargo: ${error.message || 'Desconocido'}`);
        }
    };

    const handleSeed = async () => {
        if (!confirm('¿Quieres generar 5 encargos de prueba?')) return;
        try {
            setLoading(true);
            await seedEncargos();
            await loadEncargos();
            alert('Datos de prueba generados correctamente');
        } catch (error) {
            console.error('Error seeding encargos:', error);
            alert('Error al generar datos de prueba');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !encargos.length) { // Only showing loading on initial empty state
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-[var(--color-text-light)] text-lg">Cargando encargos...</p>
            </div>
        );
    }

    const handleDeleteAll = async () => {
        if (!confirm('¿Estás SEGURO de borrar TODOS los encargos?')) return;
        try {
            setLoading(true);
            await deleteAllEncargos();
            await loadEncargos();
            alert('Todos los encargos han sido eliminados');
        } catch (error) {
            console.error('Error deleting all encargos:', error);
            alert('Error al eliminar todos los encargos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-4">
            <div className="flex justify-between mb-4">
                <Button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2">
                    {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showCreate ? 'Cancelar' : 'Nuevo Encargo Manual'}
                </Button>

                <Button onClick={handleDeleteAll} variant="secondary" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Borrar Todo
                </Button>
            </div>

            {showCreate && (
                <Card className="p-6 mb-6 border-2 border-[var(--color-primary)]/20 shadow-lg animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">Registrar Nuevo Encargo</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre Cliente</label>
                                <Input
                                    value={newEncargo.name}
                                    onChange={e => setNewEncargo({ ...newEncargo, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Teléfono</label>
                                <Input
                                    value={newEncargo.phone}
                                    onChange={e => setNewEncargo({ ...newEncargo, phone: e.target.value })}
                                    placeholder="Ej: 600 123 456"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción / Notas</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                                rows={3}
                                value={newEncargo.description}
                                onChange={e => setNewEncargo({ ...newEncargo, description: e.target.value })}
                                placeholder="Ej: Busca casa grande con 7 habitaciones, presupuesto 2.5K..."
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
                            <Button type="submit" className="flex items-center gap-2">
                                <Save className="w-4 h-4" /> Guardar Encargo
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {encargos.length === 0 && !showCreate && (
                <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No hay encargos</h3>
                    <p className="text-[var(--color-text-light)] mb-6">
                        Aún no has recibido ninguna solicitud de búsqueda.
                    </p>
                    <Button onClick={handleSeed} variant="secondary">
                        Generar Datos de Prueba
                    </Button>
                </Card>
            )}
            {encargos.map((encargo) => (
                <Card key={encargo.id} className={`p-6 transition-colors ${encargo.published ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                                <h3 className="font-semibold text-lg">{encargo.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${encargo.operation === 'venta' ? 'bg-green-100 text-green-800' :
                                        encargo.operation === 'alquiler' ? 'bg-blue-100 text-blue-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                        {encargo.operation === 'opcion_compra' ? 'Opción Compra' : encargo.operation}
                                    </span>
                                    {encargo.published && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            Publicado
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {encargo.createdAt?.seconds ? new Date(encargo.createdAt.seconds * 1000).toLocaleDateString() : 'Fecha desconocida'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1 text-sm text-[var(--color-text-light)]">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <a href={`tel:${encargo.phone}`} className="hover:text-[var(--color-primary)]">{encargo.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <a
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encargo.email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[var(--color-primary)]"
                                        >
                                            {encargo.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Busca:</span>
                                        {encargo.type || 'Cualquier tipo'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {encargo.zone || 'Cualquier zona'}
                                    </div>
                                    {/* Price logic */}
                                    <div className="flex items-center gap-2">
                                        <Euro className="w-4 h-4 text-gray-400" />
                                        {encargo.priceMin && encargo.priceMax
                                            ? `${encargo.priceMin.toLocaleString()} - ${encargo.priceMax.toLocaleString()} €`
                                            : encargo.priceMax
                                                ? `Hasta ${encargo.priceMax.toLocaleString()} €`
                                                : 'Presupuesto a consultar'}
                                    </div>
                                </div>
                            </div>

                            {encargo.description && (
                                <div className="bg-gray-50 p-3 rounded-lg text-sm text-[var(--color-text)] italic border border-gray-100 whitespace-pre-wrap">
                                    "{encargo.description}"
                                </div>
                            )}

                            {(encargo.bedrooms || encargo.bathrooms) && (
                                <div className="mt-3 flex gap-4 text-sm text-gray-500">
                                    {encargo.bedrooms && <span>🛏️ Min {encargo.bedrooms} hab</span>}
                                    {encargo.bathrooms && <span>🚿 Min {encargo.bathrooms} baños</span>}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                            <Button
                                variant={encargo.published ? "secondary" : "primary"}
                                size="sm"
                                onClick={() => handleTogglePublish(encargo)}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 ${encargo.published ? 'text-gray-600' : ''}`}
                            >
                                {encargo.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {encargo.published ? 'Ocultar' : 'Publicar'}
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => encargo.id && handleDelete(encargo.id, encargo.name)}
                                className="flex-1 md:flex-none text-red-600 hover:bg-red-50 flex items-center gap-2 justify-center"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
