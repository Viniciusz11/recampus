import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// resolve.tsconfigPaths lê o "paths" do tsconfig.app.json nativamente (Vite
// 8+), então o alias "@/*" fica definido em um único lugar sem precisar do
// plugin vite-tsconfig-paths nem duplicar em resolve.alias.
// @tailwindcss/vite (Tailwind v4) substitui o pipeline PostCSS + autoprefixer:
// detecta o conteúdo automaticamente pelo grafo de módulos do Vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
  },
});
