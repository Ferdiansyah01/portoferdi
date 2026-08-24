import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    // Phaser 1.48MB wajar >500k — naikkan limit biar warning hilang
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/phaser')) return 'phaser';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
