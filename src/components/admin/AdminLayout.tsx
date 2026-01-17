import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, Home, Settings } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            await logout();
            navigate('/admin/login');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Header */}
            <header className="bg-white border-b border-[var(--color-border)] shadow-sm">
                <div className="container-custom py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <Link to="/admin" className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                                <h1 className="text-xl font-serif font-bold">Admin Panel</h1>
                            </Link>
                            <p className="text-sm text-[var(--color-text-light)]">Ballestrino-Araque</p>
                            <Link to="/admin/settings" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 mt-1">
                                <Settings className="w-3 h-3" />
                                Configuración Global
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/">
                                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Ver Web
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom py-8">
                <Outlet />
            </main>
        </div>
    );
};
