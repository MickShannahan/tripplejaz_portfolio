import sharp from 'sharp'
import { encode } from 'blurhash'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GALLERY_ROOT = path.join(__dirname, '../../public/gallery')
const THUMBNAILS_DIR = path.join(GALLERY_ROOT, '_thumbnails')
const MANIFEST_FILE = path.join(GALLERY_ROOT, 'imageManifest.json')
const THUMBNAIL_WIDTH = 600
const BLURHASH_COMPONENTS_X = 4
const BLURHASH_COMPONENTS_Y = 3

// Supported image extensions
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * Generate blur hash from image buffer
 * @param {Buffer} imageBuffer - Image data
 * @returns {Promise<string>} Blur hash string
 */
async function generateBlurHash(imageBuffer) {
  try {
    // Resize image to small size for blurhash calculation
    // Ensure we have RGB format (3 bytes per pixel)
    const image = sharp(imageBuffer)
      .resize(100, 100, { fit: 'cover' })
      .toColorspace('srgb')

    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Sharp may return different channel counts depending on the input format
    // Convert to RGBA format (4 bytes per pixel) that blurhash expects
    const pixelCount = info.width * info.height
    const rgba = Buffer.alloc(pixelCount * 4)

    if (info.channels === 3) {
      // RGB -> RGBA
      let srcIdx = 0
      for (let i = 0; i < pixelCount; i++) {
        rgba[i * 4] = data[srcIdx++]      // R
        rgba[i * 4 + 1] = data[srcIdx++]  // G
        rgba[i * 4 + 2] = data[srcIdx++]  // B
        rgba[i * 4 + 3] = 255             // A (opaque)
      }
    } else if (info.channels === 4) {
      // Already RGBA
      data.copy(rgba)
    } else if (info.channels === 1) {
      // Grayscale -> RGBA
      let srcIdx = 0
      for (let i = 0; i < pixelCount; i++) {
        const gray = data[srcIdx++]
        rgba[i * 4] = gray       // R
        rgba[i * 4 + 1] = gray   // G
        rgba[i * 4 + 2] = gray   // B
        rgba[i * 4 + 3] = 255    // A
      }
    }

    const blurHash = encode(rgba, info.width, info.height, BLURHASH_COMPONENTS_X, BLURHASH_COMPONENTS_Y)
    return blurHash
  } catch (error) {
    console.error(`Error generating blur hash:`, error.message)
    return null
  }
}

/**
 * Generate thumbnail from image
 * @param {string} imagePath - Full path to original image
 * @param {string} outputPath - Full path for thumbnail output
 * @returns {Promise<void>}
 */
async function generateThumbnail(imagePath, outputPath) {
  try {
    await sharp(imagePath)
      .resize(THUMBNAIL_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: 60 })
      .toFile(outputPath)
  } catch (error) {
    console.error(`Error generating thumbnail for ${imagePath}:`, error)
    throw error
  }
}

/**
 * Get image dimensions
 * @param {Buffer} imageBuffer - Image data
 * @returns {Promise<{width: number, height: number}>}
 */
async function getImageDimensions(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata()
    return {
      width: metadata.width,
      height: metadata.height
    }
  } catch (error) {
    console.error('Error getting image dimensions:', error)
    return { width: 0, height: 0 }
  }
}

/**
 * Recursively scan directory for images
 * @param {string} dirPath - Directory to scan
 * @param {string} relativePath - Path relative to gallery root
 * @returns {Array<{path: string, fullPath: string}>} Array of image objects
 */
function findImages(dirPath, relativePath = '') {
  const images = []

  if (!fs.existsSync(dirPath)) {
    return images
  }

  const files = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const file of files) {
    if (file.name.startsWith('_') || file.name.startsWith('.')) {
      continue // Skip hidden and special directories
    }

    const fullPath = path.join(dirPath, file.name)
    const relPath = relativePath ? `${relativePath}/${file.name}` : file.name

    if (file.isDirectory()) {
      images.push(...findImages(fullPath, relPath))
    } else {
      const ext = path.extname(file.name).toLowerCase()
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        images.push({ path: relPath, fullPath })
      }
    }
  }

  return images
}

/**
 * Main processing function
 */
async function processGalleryImages() {
  console.log('🖼️  Starting gallery image processing...\n')

  // Ensure thumbnails directory exists
  if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true })
  }

  // Find all images in gallery
  const images = findImages(GALLERY_ROOT)
  if (images.length === 0) {
    console.warn('⚠️  No images found in gallery directory')
    // Still create empty manifest
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify({ images: [] }, null, 2))
    return
  }

  console.log(`📷 Found ${images.length} images to process\n`)

  const manifest = {
    generated: new Date().toISOString(),
    totalImages: images.length,
    images: []
  }

  // Process each image
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const imageBuffer = fs.readFileSync(image.fullPath)

    process.stdout.write(`\r⏳ Processing [${i + 1}/${images.length}] ${image.path}`)

    try {
      // Generate thumbnail
      const thumbnailSubPath = image.path.replace(/\.[^.]*$/, '.webp')
      const thumbnailDir = path.dirname(path.join(THUMBNAILS_DIR, thumbnailSubPath))
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true })
      }
      const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailSubPath)
      await generateThumbnail(image.fullPath, thumbnailPath)

      // Generate blur hash
      const blurHash = await generateBlurHash(imageBuffer)

      // Get image dimensions
      const { width, height } = await getImageDimensions(imageBuffer)

      // Add to manifest
      manifest.images.push({
        path: image.path,
        thumbnailPath: `_thumbnails/${thumbnailSubPath}`,
        blurHash,
        width,
        height
      })
    } catch (error) {
      console.error(`\n❌ Error processing ${image.path}:`, error.message)
    }
  }

  console.log('\n')

  // Write manifest file
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2))

  console.log(`✅ Processing complete!`)
  console.log(`📊 Generated ${manifest.images.length} images with thumbnails and blur hashes`)
  console.log(`📄 Manifest saved to: ${MANIFEST_FILE}\n`)
}

// Run the processor
processGalleryImages().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
