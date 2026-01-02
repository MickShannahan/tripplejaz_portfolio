/**
 * Get the base path for the application
 * This is needed for GitHub Pages deployment where the app is in a subdirectory
 */
export function getBasePath() {
  return import.meta.env.BASE_URL
}

/**
 * Build a full path to a gallery image, accounting for the application base path
 * @param {string} imagePath - The relative path to the image (e.g., 'concept_art/image.jpg')
 * @returns {string} - The full path to the image
 */
export function getGalleryImagePath(imagePath) {
  return `${getBasePath()}gallery/${imagePath}`
}
