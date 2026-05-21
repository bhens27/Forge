import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: { host: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'FORGE',
        short_name: 'FORGE',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0A0E14',
        background_color: '#0A0E14',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
