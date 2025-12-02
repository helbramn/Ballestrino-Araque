import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { EncargosPage } from './pages/EncargosPage';
import { InvestorsPage } from './pages/InvestorsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <MainLayout>
                <HomePage />
            </MainLayout>
        ),
        errorElement: (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">¡Ups! Algo salió mal.</h1>
                <p className="mb-4">Ha ocurrido un error inesperado.</p>
                <a href="/" className="text-blue-600 hover:underline">Volver al inicio</a>
            </div>
        ),
    },
    {
        path: '/propiedades',
        element: (
            <MainLayout>
                <PropertiesPage />
            </MainLayout>
        ),
    },
    {
        path: '/propiedad/:id',
        element: (
            <MainLayout>
                <PropertyDetailPage />
            </MainLayout>
        ),
    },
    {
        path: '/encargos',
        element: (
            <MainLayout>
                <EncargosPage />
            </MainLayout>
        ),
    },
    {
        path: '/inversores',
        element: (
            <MainLayout>
                <InvestorsPage />
            </MainLayout>
        ),
    },
]);
