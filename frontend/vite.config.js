import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base '/' ensures assets resolve correctly on Vercel's CDN
  base: '/',
  build: {
    // Vercel deploys from this directory
    outDir: 'dist',
  },
  server: {
    port: 5173
  }
})
