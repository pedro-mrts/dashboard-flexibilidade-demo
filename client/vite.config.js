import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Em produção via Node (npm start), o site é servido na raiz do domínio,
  // então base fica em "/". Para publicar em GitHub Pages (subpath
  // /<repositorio>/), o workflow de deploy define VITE_BASE_PATH antes do
  // build — ver .github/workflows/deploy-pages.yml.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, o Vite roda em uma porta separada da API Node.
    // Esse proxy encaminha as chamadas /api/* para o servidor Express
    // (server/index.js, porta 4000), para que o front-end sempre possa
    // usar caminhos relativos como fetch('/api/paineis/diagnostico').
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
