import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { EncargosPage } from './pages/EncargosPage';
import { InvestorsPage } from './pages/InvestorsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="propiedades" element={<PropertiesPage />} />
          <Route path="propiedad/:id" element={<PropertyDetailPage />} />
          <Route path="encargos" element={<EncargosPage />} />
          <Route path="inversores" element={<InvestorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
