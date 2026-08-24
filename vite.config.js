import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', compressionOptions: { level: 11 } }),
  ],
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
