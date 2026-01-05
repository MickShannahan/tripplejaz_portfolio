

import { decode } from 'blurhash'

/**
 * Decode a blurhash string and return it as a data URL for use as a placeholder
 * @param {string} blurHash - The blurhash string
 * @param {number} width - Width of the placeholder image
 * @param {number} height - Height of the placeholder image
 * @returns {string} Data URL that can be used as an img src
 */
export function decodeBlurHash(blurHash, width = 100, height = 100) {
  if (!blurHash) return null

  try {
    const pixels = decode(blurHash, width, height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error decoding blurhash:', error)
    return null
  }
}

/**
 * Create a CSS blur effect that can be applied while image loads
 * Used as fallback if blurhash decoding fails
 * @param {string} color - Background color for the blur effect
 * @returns {object} CSS style object
 */
export function createBlurPlaceholderStyle(color = '#e0e0e0') {
  return {
    backgroundColor: color,
    backdropFilter: 'blur(10px)',
    animation: 'pulse 1.5s ease-in-out infinite'
  }
}

/**
 * Preload an image from a given source
 * @param {string} src - Image source URL
 * @returns {Promise<Image>} Resolves when image is loaded
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Get thumbnail path for an image from the manifest
 * @param {string} imagePath - Original image path
 * @param {object} manifest - Image manifest object
 * @returns {string|null} Thumbnail path or null
 */
export function getThumbnailPath(imagePath, manifest) {
  if (!manifest || !manifest.images) return null

  const imageData = manifest.images.find(img => img.path === imagePath)
  return imageData?.thumbnailPath || null
}

/**
 * Get blurhash for an image from the manifest
 * @param {string} imagePath - Original image path
 * @param {object} manifest - Image manifest object
 * @returns {string|null} Blurhash string or null
 */
export function getBlurHash(imagePath, manifest) {
  if (!manifest || !manifest.images) return null

  const imageData = manifest.images.find(img => img.path === imagePath)
  return imageData?.blurHash || null
}

/**
 * Fetch and return the image manifest
 * @returns {Promise<object>} Manifest object
 */
export async function loadImageManifest() {
  try {
    const response = await fetch('/gallery/imageManifest.json')
    if (!response.ok) {
      console.warn('Manifest file not found. Run npm run process-images to generate it.')
      return { images: [] }
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading image manifest:', error)
    return { images: [] }
  }
}

/**
 * Create a thumbnail version of an image (client-side)
 * Note: For production, use sharp on the server side via npm run process-images
 * This is mainly for reference and local testing
 * @param {HTMLImageElement} img - Image element
 * @param {number} maxWidth - Maximum width for thumbnail
 * @param {number} maxHeight - Maximum height for thumbnail
 * @returns {string} Data URL of thumbnail
 */
export function createThumbnail(img, maxWidth = 400, maxHeight = 300) {
  const canvas = document.createElement('canvas')

  let width = img.naturalWidth
  let height = img.naturalHeight

  // Calculate scaled dimensions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round(height * maxWidth / width)
      width = maxWidth
    }
  } else {
    if (height > maxHeight) {
      width = Math.round(width * maxHeight / height)
      height = maxHeight
    }
  }

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', 0.85)
}

