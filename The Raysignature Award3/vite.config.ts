import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Fixes the mapping so both your code imports and public asset paths match perfectly
        '@': path.resolve(__dirname, './src'),
        '#': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Keep Google AI Studio's strict internal sandbox requirements intact
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Forces the web preview to aggressively update static assets like your .glb
      fs: {
        allow: ['.'],
      },
    },
  };
});