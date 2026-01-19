import { createRouter, createWebHashHistory } from 'vue-router'
import { useHead } from '@unhead/vue'
import { AppState } from './AppState'

// Dynamically import all page components and their configs
const pageModules = import.meta.glob('./pages/[0-9][0-9]_*.vue', { eager: true })

// Create a map of pageConfig to component for efficient lookup
const configToComponentMap = new Map(
  Object.entries(pageModules).map(([path, module]) => [
    module.pageConfig,
    module.default
  ])
)

// Extract page configs and create routes
const pageConfigs = Object.entries(pageModules)
  .map(([path, module]) => module.pageConfig)
  .filter(config => config && !config.hiddenPage)
  .sort((a, b) => a.navOrder - b.navOrder)

// Build routes from page configs
const routes = pageConfigs.map(pageConfig => ({
  path: pageConfig.routePath === '/' ? '/' : pageConfig.routePath,
  name: pageConfig.name,
  component: configToComponentMap.get(pageConfig),
  meta: {
    pageConfig,
    title: pageConfig.title,
    theme: pageConfig.theme
  }
}))

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})

// Handle head updates on route change
router.beforeEach((to, from, next) => {
  const pageConfig = to.meta?.pageConfig

  if (pageConfig) {
    useHead({
      title: pageConfig.getFullTitle(AppState.baseSiteTitle),
      meta: [{ property: '', content: '' }],
      htmlAttrs: { 'data-bs-theme': pageConfig.theme }
    })
  }

  next()
})
