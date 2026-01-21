import { AppState } from '../AppState.js';
import { decodeBlurHash } from '../utils/imageUtils.js';

let manifestCache = null;

export class GalleryImage {
  constructor({ path = '', width, height, thumbnailPath, blurHash, title, description }) {
    this.path = path
    this.name = path.slice(path.lastIndexOf('/') + 1)
    this.title = title
    this.description = description || ''
    this.thumbnailPath = thumbnailPath || null
    this.width = width || 0
    this.height = height || 0
    this.blurHash = blurHash ? decodeBlurHash(blurHash, Math.round(this.width / 100), Math.round(this.height / 100)) : ''

    // Initialize both loaders
    // this.loadManifestData()
  }

  /**
   * Load blur hash and thumbnail path from manifest
   */
  loadManifestData() {
    try {
      // // Load manifest once and cache it
      // if (!AppState.manifestCache) {
      //   const response = await fetch('/gallery/imageManifest.json')
      //   if (!response.ok) {
      //     console.warn('Manifest file not found. Run npm run process-images to generate it.')
      //     return
      //   }
      //   AppState.manifestCache = await response.json()
      // } else {
      //   // console.log('cache already loaded')
      // }


      // Find this image in manifest
      const imageData = AppState.galleryManifest.images.find(img => img.path === this.path)
      if (imageData) {
        this.height = imageData.height
        this.width = imageData.width
        this.blurHash = decodeBlurHash(
          imageData.blurHash,
          Math.round(imageData.width / 100),
          Math.round(imageData.height / 100)
        )
        this.thumbnailPath = imageData.thumbnailPath
        // console.log(this.blurHash, this.thumbnailPath)
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
