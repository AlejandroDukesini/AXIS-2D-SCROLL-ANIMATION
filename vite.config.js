import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    // Separa las dependencias grandes en chunks propios: mejoran el cacheo
    // entre deploys (el vendor no cambia aunque cambie el código de la app)
    // y permiten descargar React y el motor de animación en paralelo.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
})
