/**
 * Page Model - Defines metadata and configuration for gallery pages
 */
export class Page {
  constructor({
    navOrder = 0,
    routePath = '/',
    hiddenPage = false,
    galleryFolder = '',
    galleryGridClass = 'columns',
    galleryGridRowWidth = 300,
    name = '',
    title = '',
    theme = 'dark',
    component = null,
    bgStyle
  } = {}) {
    this.navOrder = navOrder
    this.routePath = routePath
    this.hiddenPage = hiddenPage
    this.galleryFolder = galleryFolder
    this.galleryGridClass = galleryGridClass
    this.galleryGridRowWidth = galleryGridRowWidth
    this.name = name
    this.title = title
    this.theme = theme
    this.component = component,
      this.bgStyle = bgStyle
  }

  /**
   * Check if this page is a gallery page (has a folder defined)
   */
  isGalleryPage() {
    return Boolean(this.galleryFolder)
  }

  /**
   * Get the full page title with base site title
   */
  getFullTitle(baseSiteTitle) {
    if (this.title) {
      return `${baseSiteTitle} | ${this.title}`
    }
    return baseSiteTitle
  }
}
