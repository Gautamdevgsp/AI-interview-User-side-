import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
    '3237-2401-4900-1c70-6e38-75d6-ffb8-80e9-eabd.ngrok-free.app'
  ]
  }
})
