import { defineConfig } from 'vite'

// Project Pages: https://<user>.github.io/cutforge/
const base = process.env.GITHUB_PAGES === 'true' ? '/cutforge/' : '/'

export default defineConfig({
  base,
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
