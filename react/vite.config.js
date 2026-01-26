import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: ['react/src/main.jsx'], // putanja do tvog main.jsx
      refresh: true, // omogućava React Fast Refresh
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'react/src'), // opcionalno za lakše importovanje
    },
  },
});

