import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://webathon-1-0-r2-backend.onrender.com',
        changeOrigin: true
      }
    }
  }
})
