import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            // Ovo govori Laravelu da traži tvoj React kod u folderu 'react'
            input: ['react/src/main.jsx'], 
            refresh: true,
            buildDirectory: 'build',
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        // Vite će izbaciti sve fajlove u public/build
        outDir: 'public/build', 
        manifest: true,
        emptyOutDir: true,
    }
});