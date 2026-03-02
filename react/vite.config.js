import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← assuming this is a valid plugin; if not, remove it or fix import

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
  proxy: {
    '/api': {
      target: 'http://host.docker.internal:8000',   // ← ovo menjaš
      changeOrigin: true,
      secure: false,
    }
  }
}

    // Optional: helps with file watching in Docker (Windows + bind mounts can be slow)
   
})