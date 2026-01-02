import { createRouter, createWebHashHistory } from 'vue-router'
import { AppState } from './AppState.js'

function loadPage(page) {
  return () => import(`./pages/${page}`)
}

function generateRoutes() {
  const pages = import.meta.glob('./pages/*.vue', { eager: true })
  const routes = []
  const routeEntries = []

  for (const path in pages) {
    const filename = path.match(/\/pages\/(.+)\.vue$/)[1]

    // Extract number prefix if exists (e.g., "01_Paintings" or "01-Paintings" -> number: 1, name: "Paintings")
    const numberMatch = filename.match(/^(\d+)[-_](.+)$/)
    const number = numberMatch ? parseInt(numberMatch[1]) : Infinity
    const cleanName = numberMatch ? numberMatch[2] : filename

    routeEntries.push({
      filename,
      cleanName,
      number,
      path,
      component: pages[path].default
    })
  }

  // Sort by number (if present), then by original order
  routeEntries.sort((a, b) => a.number - b.number)

  // Create route objects
  for (const entry of routeEntries) {
    // Replace underscores with spaces for display name
    const displayName = entry.cleanName.replace(/_/g, ' ')
    // Replace underscores with dashes for URL path
    const pathName = entry.cleanName.replace(/_/g, '-').toLowerCase()
    const routePath = entry.cleanName === AppState.landingPage ? '/' : `/${pathName}`
    const routeName = displayName

    routes.push({
      path: routePath,
      name: routeName,
      component: entry.component
    })
  }
  console.log(routes)

  return routes
}

export const routes = generateRoutes()

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})
