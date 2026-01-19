/**
 * Download Gallery Images from Google Drive
 * 
 * Downloads images from your Google Drive folder to docs/gallery/
 * Useful for CI/CD pipelines and local development
 * 
 * Usage:
 *   npm run download-gallery              # Download new/missing images
 *   npm run download-gallery:force        # Force re-download all images
 *   npm run download-gallery:dry          # Dry run (show what would download)
 * 
 * Options:
 *   --force    Force re-download all images (ignore existing files)
 *   --dry-run  Show what would be downloaded without actually downloading
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import GoogleDriveReader from './GoogleDriveReader.js';

// Determine output directory based on NODE_ENV
const isDevMode = process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV == 'development';
const galleryDir = 'public/gallery'
const GALLERY_ROOT = path.join(__dirname, `../../${galleryDir}`);
const MANIFEST_FILE = path.join(GALLERY_ROOT, 'downloadManifest.json');

// Parse command line arguments
const args = process.argv.slice(2);
const forceRedownload = args.includes('--force');
const dryRun = args.includes('--dry-run');

console.log('env', isDevMode,)
/**
 * Load existing download manifest to avoid re-downloading
 */
function loadManifest() {
  try {
    if (fs.existsSync(MANIFEST_FILE)) {
      return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
    }
  } catch (error) {
    console.warn('⚠️ Could not load manifest, will download all files');
  }
  return {};
}

/**
 * Save download manifest
 */
function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

/**
 * Recursively find all image files on disk and remove ones not in Google Drive
 */
async function cleanupOrphanedFiles(currentGoogleDriveFiles) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const orphanedFiles = [];

  function walkDirectory(dirPath, baseRelativePath = '') {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        // Skip thumbnail directories
        if (item.name === '_thumbnails') continue;

        const fullPath = path.join(dirPath, item.name);
        const relativePath = baseRelativePath ? `${baseRelativePath}/${item.name}` : item.name;

        if (item.isDirectory()) {
          walkDirectory(fullPath, relativePath);
        } else if (item.isFile()) {
          const fileName = item.name.toLowerCase();
          const isImage = imageExtensions.some(ext => fileName.endsWith(ext));

          if (isImage) {
            // Check if this file exists in Google Drive
            if (!currentGoogleDriveFiles.has(relativePath)) {
              if (!dryRun) {
                try {
                  fs.unlinkSync(fullPath);
                  console.log(`🗑️  Deleted orphaned file: ${relativePath}`);
                } catch (err) {
                  console.warn(`⚠️  Could not delete ${relativePath}:`, err.message);
                }
              } else {
                console.log(`📋 [DRY RUN] Would delete: ${relativePath}`);
              }
              orphanedFiles.push(relativePath);
            }
          }
        }
      }
    } catch (err) {
      console.warn(`⚠️  Error reading directory ${dirPath}:`, err.message);
    }
  }

  walkDirectory(GALLERY_ROOT);
  return orphanedFiles;
}

/**
 * Download a single file
 */
async function downloadFile(reader, fileId, outputPath, fileInfo) {
  try {
    if (!dryRun) {
      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const accessToken = await reader.getAccessToken();

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Handle both Node.js and browser fetch APIs
      let buffer;
      if (response.buffer) {
        // Node.js fetch might have buffer method
        buffer = await response.buffer();
      } else if (response.arrayBuffer) {
        // Standard fetch API
        buffer = await response.arrayBuffer();
      } else {
        // Fallback: read as text and convert
        const data = await response.text();
        buffer = Buffer.from(data, 'binary');
      }

      const dir = path.dirname(outputPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, Buffer.from(buffer));
    }

    return {
      fileId,
      filename: path.basename(outputPath),
      filePath: path.relative(GALLERY_ROOT, outputPath),
      size: fileInfo.size || 0,
      modifiedTime: fileInfo.modifiedTime,
      downloadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Failed to download ${fileInfo.name}:`, error.message);
    throw error;
  }
}

/**
 * Main download function
 */
export async function downloadGalleryImages() {
  try {
    console.log('🔍 Initializing Google Drive Reader...');
    const reader = new GoogleDriveReader();
    console.log('✅ Reader initialized\n');

    console.log('📁 Fetching gallery structure from Google Drive...');
    const allFiles = await reader.listFiles(reader.folderId, true);
    console.log(`✅ Found ${allFiles.length} items\n`);

    // Get all image files
    const images = await reader.getImageFiles();
    console.log(`🖼️ Found ${images.length} image files\n`);
    console.log(`📂 Destination: ${isDevMode ? 'public/gallery (DEV mode)' : 'docs/gallery (production)'}\n`);

    // Load existing manifest
    let manifest = loadManifest();

    if (forceRedownload) {
      console.log('🔄 Force re-download mode - will download all files\n');
      manifest = {};
    }

    // Clean up files on disk that are no longer on Google Drive
    console.log('🧹 Cleaning up orphaned files...');
    const currentGoogleDriveFiles = new Set(images.map(img => img.path));
    const orphanedFiles = await cleanupOrphanedFiles(currentGoogleDriveFiles);

    // Remove orphaned files from manifest
    for (const orphanedPath of orphanedFiles) {
      for (const [fileId, entry] of Object.entries(manifest)) {
        if (entry.filePath === orphanedPath) {
          delete manifest[fileId];
          break;
        }
      }
    }

    // Track downloads
    let downloadCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const newDownloads = {};

    // Download images
    console.log('📥 Starting downloads...\n');

    for (const image of images) {
      const fileId = image.id;
      const filePath = image.path;

      // Check if already downloaded and unchanged
      if (!forceRedownload && manifest[fileId]) {
        // Verify file hasn't changed by comparing size and modification time
        const previousEntry = manifest[fileId];
        const fileChanged = previousEntry.size !== image.size ||
          previousEntry.modifiedTime !== image.modifiedTime;

        if (!fileChanged) {
          console.log(`⏭️  Skipped: ${filePath}`);
          skippedCount++;
          continue;
        } else {
          console.log(`🔄 Updated: ${filePath} (changed on Drive)`);
        }
      }

      // Prepare output path
      const outputPath = path.join(GALLERY_ROOT, filePath);

      try {
        if (dryRun) {
          console.log(`📋 [DRY RUN] Would download: ${filePath}`);
          const sizeStr = image.size ? ` (${(image.size / 1024 / 1024).toFixed(2)} MB)` : '';
          console.log(`           Size: ${sizeStr}`);
        } else {
          console.log(`⬇️  Downloading: ${filePath}`);
        }

        const downloadInfo = await downloadFile(reader, fileId, outputPath, image);
        newDownloads[fileId] = downloadInfo;
        downloadCount++;
      } catch (error) {
        failedCount++;
      }
    }

    // Update manifest with new downloads
    manifest = { ...manifest, ...newDownloads };

    if (!dryRun) {
      saveManifest(manifest);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Download Summary');
    console.log('='.repeat(50));
    console.log(`✅ Downloaded: ${downloadCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Failed: ${failedCount}`);

    console.log(`📦 Total tracked: ${Object.keys(manifest).length}`)

    if (dryRun) {
      console.log('\n(This was a DRY RUN - no files were actually downloaded)');
    }

    console.log(`\n📂 Images saved to: ${GALLERY_ROOT}`);
    console.log(`📋 Manifest saved to: ${MANIFEST_FILE}`);

    return {
      downloaded: downloadCount,
      skipped: skippedCount,
      failed: failedCount,
      total: Object.keys(manifest).length
    };
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
const currentFileUrl = import.meta.url;
const isMainModule = process.argv[1] && (currentFileUrl.includes(process.argv[1]) || currentFileUrl.endsWith('downloadGalleryImages.js'));

if (isMainModule) {
  downloadGalleryImages().catch(console.error);
}

export default downloadGalleryImages;
