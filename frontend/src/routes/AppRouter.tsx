import { Route, Routes } from 'react-router-dom';
import { AppShellLayout } from '@/layouts/AppShellLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdDetailPage } from '@/pages/AdDetailPage';
import { BrowseAdsPage } from '@/pages/BrowseAdsPage';
import { EditAdPage } from '@/pages/EditAdPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { MyAdsPage } from '@/pages/MyAdsPage';
import { NewAdPage } from '@/pages/NewAdPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/anuncios" element={<BrowseAdsPage />} />
        <Route path="/anuncios/:id" element={<AdDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShellLayout />}>
          <Route path="/app" element={<BrowseAdsPage />} />
          <Route path="/app/anuncios/novo" element={<NewAdPage />} />
          <Route path="/app/anuncios/:id/editar" element={<EditAdPage />} />
          <Route path="/app/meus-anuncios" element={<MyAdsPage />} />
          <Route path="/app/perfil" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
