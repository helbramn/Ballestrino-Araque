import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, Home } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            await logout();
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Header */}
            <header className="bg-white border-b border-[var(--color-border)] shadow-sm">
                <div className="container-custom py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link to="/admin" className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                                Panel Admin
                            </Link>
                            <p className="text-sm text-[var(--color-text-light)]">Carlota Inmob</p>
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
