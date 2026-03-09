import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: ['react/src/main.jsx'],
            refresh: true,
            // Ovo osigurava da manifest bude u public/build
            buildDirectory: 'build', 
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        // Ovo će naterati Vite da izbaci fajlove tamo gde Laravel očekuje
        outDir: '../public/build', 
        emptyOutDir: true,
    }
})