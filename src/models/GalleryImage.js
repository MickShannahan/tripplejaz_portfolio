import { AppState } from '../AppState.js';
import { decodeBlurHash } from '../utils/imageUtils.js';

let manifestCache = null;

export class GalleryImage {
  constructor({ path = '', title, description }) {
    this.path = path
    this.name = path.slice(path.lastIndexOf('/') + 1)
    this.title = title
    this.description = description || ''
    this.thumbnailPath
    this.blurHash

    // Initialize both loaders
    this.loadManifestData()
  }

  /**
   * Load blur hash and thumbnail path from manifest
   */
  async loadManifestData() {
    try {
      // Load manifest once and cache it
      if (!AppState.manifestCache) {
        const response = await fetch('/gallery/imageManifest.json')
        if (!response.ok) {
          console.warn('Manifest file not found. Run npm run process-images to generate it.')
          return
        }
        AppState.manifestCache = await response.json()
      } else {
        console.log('cache already loaded')
      }


      // Find this image in manifest
      const imageData = AppState.manifestCache.images.find(img => img.path === this.path)
      if (imageData) {
        this.height = imageData.height
        this.width = imageData.width
        this.blurHash = decodeBlurHash(
          imageData.blurHash,
          Math.round(imageData.width / 100),
          Math.round(imageData.height / 100)
        )
        this.thumbnailPath = imageData.thumbnailPath
        console.log(this.blurHash, this.thumbnailPath)
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
