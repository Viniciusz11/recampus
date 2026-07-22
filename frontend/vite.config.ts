import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// resolve.tsconfigPaths lê o "paths" do tsconfig.app.json nativamente (Vite
// 8+), então o alias "@/*" fica definido em um único lugar sem precisar do
// plugin vite-tsconfig-paths nem duplicar em resolve.alias.
// @tailwindcss/vite (Tailwind v4) substitui o pipeline PostCSS + autoprefixer:
// detecta o conteúdo automaticamente pelo grafo de módulos do Vite.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // autoUpdate: a cada novo deploy, o novo Service Worker assume sozinho
      // na próxima navegação, sem precisar de um prompt "há uma atualização,
      // recarregar?" - correto para um app sem estado local complexo em
      // formulário parado no meio de uma sessão longa.
      registerType: 'autoUpdate',
      // Deixa o SW ativo também em `npm run dev`, não só no build de
      // produção - permite testar instalação/offline sem precisar de
      // `vite build && vite preview` a cada mudança.
      devOptions: { enabled: true },
      includeAssets: ['favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'ReCampus - Economia Circular no Campus',
        short_name: 'ReCampus',
        description:
          'Doe, venda e encontre livros, calculadoras e materiais de estudo com outros estudantes do seu campus.',
        lang: 'pt-BR',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Nunca cacheia /api/v1/auth/* (nem por omissão: só as rotas abaixo
        // são interceptadas) - login/refresh/logout têm que sempre ir à rede.
        runtimeCaching: [
          {
            // GET /ads, /ads/:id e /my-ads - a vitrine e "meus anúncios" que
            // o usuário já visitou continuam visíveis offline/com a rede
            // instável, e atualizam sozinhos assim que a rede volta.
            urlPattern: ({ url, request }) =>
              request.method === 'GET' &&
              (url.pathname.startsWith('/api/v1/ads') || url.pathname === '/api/v1/my-ads'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'recampus-ads-api',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Imagens dos anúncios (URLs externas, ex: picsum.photos) - uma
            // vez vista, a imagem continua disponível offline.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'recampus-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
  },
});
