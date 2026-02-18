import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-drei': ['@react-three/drei'],
          'three-fiber': ['@react-three/fiber'],
          'framer-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'gsap']
        }
      }
    }
  }
})
