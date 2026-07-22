import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spinner } from '@/components/common/Spinner';
import { AppShellLayout } from '@/layouts/AppShellLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Uma página por chunk: quem abre /login não precisa baixar o Framer
// Motion da landing, e quem abre a landing não precisa do react-hook-form
// usado só nos formulários de anúncio.
const LandingPage = lazy(() => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const BrowseAdsPage = lazy(() =>
  import('@/pages/BrowseAdsPage').then((m) => ({ default: m.BrowseAdsPage })),
);
const AdDetailPage = lazy(() =>
  import('@/pages/AdDetailPage').then((m) => ({ default: m.AdDetailPage })),
);
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const NewAdPage = lazy(() => import('@/pages/NewAdPage').then((m) => ({ default: m.NewAdPage })));
const EditAdPage = lazy(() => import('@/pages/EditAdPage').then((m) => ({ default: m.EditAdPage })));
const MyAdsPage = lazy(() => import('@/pages/MyAdsPage').then((m) => ({ default: m.MyAdsPage })));
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
}
