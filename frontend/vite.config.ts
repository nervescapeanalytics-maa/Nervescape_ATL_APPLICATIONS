import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API base is proxied in dev; in production nginx proxies /api to the backend.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': { target: process.env.VITE_API_TARGET || 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});
