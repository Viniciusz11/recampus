import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// vite-tsconfig-paths lê o "paths" do tsconfig.app.json, então o alias "@/*"
// fica definido em um único lugar (o tsconfig), sem duplicar em resolve.alias.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
  },
});
