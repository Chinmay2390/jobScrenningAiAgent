import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    port: 4173,
    host: true,
    open: true
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  // Add base URL configuration for proper routing in production
  base: '/',
  build: {
    // Generate SPA fallback for client-side routing
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});