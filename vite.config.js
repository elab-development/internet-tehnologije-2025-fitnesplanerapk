import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            // 1. Ovde kažeš Laravelu gde je React ulazni fajl
            input: ['react/src/main.jsx'], 
            refresh: true,
            // 2. Ovde kažeš Laravelu gde će biti manifest.json
            buildDirectory: 'build', 
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        // 3. Ovo osigurava da build ide u public/build, a ne u dist
        outDir: 'public/build',
        emptyOutDir: true,
        // 4. VAŽNO: Ovo forsira da manifest.json ne ode u .vite podfolder
        manifest: 'manifest.json', 
    }
});