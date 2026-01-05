import { reactive } from 'vue'
import { getGalleryImagePath } from '../utils/pathUtils';

let manifestCache = null;

export class GalleryImage {
  constructor({ path = '', title, description }) {
    this.path = path
    this.name = path.slice(path.lastIndexOf('/') + 1)
    this.title = title
    this.description = description || ''

    // Use reactive for properties that may update asynchronously
    const reactiveData = reactive({
      height: null,
      width: null,
      timestamp: null,
      blurHash: null,
      thumbnailPath: null,
      loaded: false
    })

    // Expose reactive properties
    Object.defineProperty(this, 'height', {
      get() { return reactiveData.height },
      set(v) { reactiveData.height = v }
    })
    Object.defineProperty(this, 'width', {
      get() { return reactiveData.width },
      set(v) { reactiveData.width = v }
    })
    Object.defineProperty(this, 'timestamp', {
      get() { return reactiveData.timestamp },
      set(v) { reactiveData.timestamp = v }
    })
    Object.defineProperty(this, 'blurHash', {
      get() { return reactiveData.blurHash },
      set(v) { reactiveData.blurHash = v }
    })
    Object.defineProperty(this, 'thumbnailPath', {
      get() { return reactiveData.thumbnailPath },
      set(v) { reactiveData.thumbnailPath = v }
    })
    Object.defineProperty(this, 'loaded', {
      get() { return reactiveData.loaded },
      set(v) { reactiveData.loaded = v }
    })

    // Initialize both loaders
    this.loadImg()
    this.loadManifestData()
  }

  async loadImg() {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.width = img.naturalWidth
        this.height = img.naturalHeight
        this.timestamp = img.lastModified ? new Date(img.lastModified) : null
        this.loaded = true
        resolve()
      }
      img.onerror = reject
      img.src = getGalleryImagePath(this.path)
    })
  }

  /**
   * Load blur hash and thumbnail path from manifest
   */
  async loadManifestData() {
    try {
      // Load manifest once and cache it
      if (!manifestCache) {
        const response = await fetch('/gallery/imageManifest.json')
        if (!response.ok) {
          console.warn('Manifest file not found. Run npm run process-images to generate it.')
          return
        }
        manifestCache = await response.json()
      }

      // Find this image in manifest
      const imageData = manifestCache.images.find(img => img.path === this.path)
      if (imageData) {
        this.blurHash = imageData.blurHash
        this.thumbnailPath = imageData.thumbnailPath
        // Override dimensions from manifest if available
        if (imageData.width) this.width = imageData.width
        if (imageData.height) this.height = imageData.height
      }
    } catch (error) {
      console.warn('Error loading manifest data:', error)
    }
  }

  get timeStampFormatted() {
    return this.timestamp?.toLocaleDateString() || 'Unknown'
  }
}
