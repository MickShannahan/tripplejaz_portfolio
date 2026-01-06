import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function sitemapPlugin() {
  return {
    name: 'vite-plugin-sitemap-generator',
    apply: 'build',
    enforce: 'post',

    async generateBundle() {
      try {
        // Dynamically import the router to extract routes
        const routerPath = path.resolve(__dirname, '../router.js')
        const { routes } = await import(routerPath)

        const domain = 'https://tripplejaz.art'
        const today = new Date().toISOString().split('T')[0]

        // Map routes to sitemap entries with default priorities
        const routePriorityMap = {
          '/': { priority: '1.0', changefreq: 'weekly' },
        }
        const defaultPriority = { priority: '0.8', changefreq: 'monthly' }

        // Determine priority for gallery/portfolio routes
        const galleryRoutes = ['concept-art', 'magic-punk', 'paintings']

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

        routes.forEach((route) => {
          const isGallery = galleryRoutes.some(g => route.path.includes(g))
          const config = routePriorityMap[route.path] ||
            (isGallery ? { priority: '0.9', changefreq: 'weekly' } : defaultPriority)

          xml += '  <url>\n'
          xml += `    <loc>${domain}${route.path}</loc>\n`
          xml += `    <lastmod>${today}</lastmod>\n`
          xml += `    <changefreq>${config.changefreq}</changefreq>\n`
          xml += `    <priority>${config.priority}</priority>\n`
          xml += '  </url>\n'
        })

        xml += '</urlset>'

        // Write to public directory (which gets copied to docs during build)
        const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml')
        fs.writeFileSync(sitemapPath, xml, 'utf-8')
        console.log(`✅ Sitemap generated with ${routes.length} routes`)
      } catch (error) {
        console.error('❌ Error generating sitemap:', error)
      }
    }
  }
}
