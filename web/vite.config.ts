import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', 
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
    resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: [process.env.ALLOWED_HOST || 'ayarfarm-web.onrender.com']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
