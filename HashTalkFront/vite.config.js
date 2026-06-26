import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://documentation-classical-vienna-pam.trycloudflare.com',
        changeOrigin: true,
        headers: {
          'Bypass-Tunnel-Reminder': 'true'
        }
      }
    }
  }
})
