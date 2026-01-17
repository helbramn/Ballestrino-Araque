import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties, deleteProperty } from '../../services/propertyService';
import type { Property } from '../../types/property';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Edit, Trash2, Home as HomeIcon, ClipboardList } from 'lucide-react';
import { AdminEncargosList } from '../../components/admin/AdminEncargosList';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'properties' | 'encargos'>('properties');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const data = await getProperties();
            setProperties(data);
        } catch (error) {
            console.error('Error loading properties:', error);
            alert('Error al cargar las propiedades');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'properties') {
            loadProperties();
        }
    }, [activeTab]);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${title}"?\nEsta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await deleteProperty(id);
            console.log('Propiedad eliminada');
            await loadProperties();
        } catch (error: any) {
            console.error('Error deleting property:', error);
            alert(`Error al eliminar la propiedad: ${error.message || 'Desconocido'}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-serif font-bold mb-2">Panel de Administración</h1>
                    <p className="text-[var(--color-text-light)]">
                        Gestiona tus propiedades y encargos
                    </p>
                </div>
                {activeTab === 'properties' && (
                    <Link to="/admin/properties/new" className="w-full md:w-auto">
                        <Button className="flex items-center justify-center gap-2 w-full md:w-auto">
                            <Plus className="w-5 h-5" />
                            Nueva Propiedad
                        </Button>
                    </Link>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button
                    className={`pb-4 px-6 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'properties'
                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('properties')}
                >
                    <div className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4" />
                        Propiedades
                    </div>
                </button>
                <button
                    className={`pb-4 px-6 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'encargos'
                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('encargos')}
                >
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Encargos
                    </div>
                </button>
            </div>

            {activeTab === 'properties' ? (
                loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-[var(--color-text-light)] text-lg">Cargando propiedades...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <Card className="p-12 text-center">
                        <HomeIcon className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-light)]" />
                        <h3 className="text-xl font-semibold mb-2">No hay propiedades</h3>
                        <p className="text-[var(--color-text-light)] mb-6">
                            Comienza añadiendo tu primera propiedad
                        </p>
                        <Link to="/admin/properties/new">
                            <Button className="flex items-center gap-2 mx-auto">
                                <Plus className="w-4 h-4" />
                                Añadir Primera Propiedad
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {properties.map((property) => (
                            <Card key={property.id} className="p-6">
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    {/* Thumbnail */}
                                    <div className="w-full md:w-32 h-48 md:h-32 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 rounded-lg overflow-hidden flex-shrink-0">
                                        {property.mainImage && (
                                            <img
                                                src={property.mainImage}
                                                alt={property.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-3">
                                            <div>
                                                <h3 className="font-semibold text-xl mb-1">{property.title}</h3>
                                                <p className="text-sm text-[var(--color-text-light)]">{property.zone}</p>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <Link to={`/admin/properties/${property.id}/edit`} className="flex-1 md:flex-none">
                                                    <Button variant="secondary" size="sm" className="flex items-center justify-center gap-2 w-full">
                                                        <Edit className="w-4 h-4" />
                                                        Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleDelete(property.id, property.title)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-[var(--color-text)] mb-3 line-clamp-2">
                                            {property.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-light)]">
                                            <span className="capitalize font-medium text-[var(--color-primary)]">
                                                {property.operation === 'opcion_compra' ? 'Alquiler + Venta' : property.operation}
                                            </span>
                                            <span>•</span>
                                            <span className="font-semibold text-[var(--color-text)]">
                                                {property.price.toLocaleString('es-ES')} €
                                                {property.operation.includes('alquiler') && '/mes'}
                                            </span>
                                            <span>•</span>
                                            <span>{property.area} m²</span>
                                            <span>•</span>
                                            <span>{property.bedrooms} hab</span>
                                            <span>•</span>
                                            <span>{property.bathrooms} baños</span>
                                            {property.highlighted && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-[var(--color-accent)] font-medium flex items-center gap-1">
                                                        ⭐ Destacada
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            ) : (
                <AdminEncargosList />
            )}
        </div>
    );
};
