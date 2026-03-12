import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            // Dodajemo ./ ispred da Vite zna da je to lokalni FOLDER, a ne biblioteka
            input: ['./react/src/main.jsx'], 
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            
            '@': resolve(__dirname, './react/src'),
        },
    },
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
    }
});