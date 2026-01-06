import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import sitemapPlugin from './src/utils/sitemapPlugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), sitemapPlugin()],
  build: {
    outDir: 'docs',
    sourcemap: false,
  },
  server: {
    port: 8080
  },
  // base: '/tripplejaz_portfolio/'
})
