export default defineConfig({
    plugins: [
        laravel({
            input: ['react/src/main.jsx'],
            refresh: true,
            buildDirectory: 'build', // Ovo je ključ za Laravel
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        outDir: 'dist', // Neka ostane 'dist'
        emptyOutDir: true,
    }
})