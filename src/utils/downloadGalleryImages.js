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

// Parse command line arguments
const args = process.argv.slice(2);
const forceRedownload = args.includes('--force');
const dryRun = args.includes('--dry-run');

console.log('env', isDevMode,)

/**
 * Recursively find all image files on disk and remove ones not in Google Drive
 * Only processes folders that exist in Google Drive
 */
async function cleanupOrphanedFiles(currentGoogleDriveFiles, allGoogleDriveFiles) {
  const syncedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.txt'];
  const orphanedFiles = [];

  // Create case-insensitive lookup for Google Drive files (Windows file systems are case-insensitive)
  const googleDriveFilesLower = new Set(Array.from(currentGoogleDriveFiles).map(p => p.toLowerCase()));

  // Extract top-level folder names from Google Drive
  const googleDriveFolders = new Set();
  for (const file of allGoogleDriveFiles) {
    if (file.isFolder) {
      googleDriveFolders.add(file.name);
    }
  }

  console.log(`📂 Google Drive folders to sync: ${Array.from(googleDriveFolders).join(', ')}`);
  console.log(`📊 Files in Google Drive to preserve: ${currentGoogleDriveFiles.size}`);

  function walkDirectory(dirPath, baseRelativePath = '') {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        // Skip thumbnail directories
        if (item.name === '_thumbnails') continue;

        const fullPath = path.join(dirPath, item.name);
        const relativePath = baseRelativePath ? `${baseRelativePath}/${item.name}` : item.name;
        // Normalize to forward slashes for consistent comparison with Google Drive paths
        const normalizedPath = relativePath.replace(/\\/g, '/');
        const normalizedPathLower = normalizedPath.toLowerCase();

        if (item.isDirectory()) {
          // Only process directories that are in Google Drive (top level only)
          const topLevelFolder = baseRelativePath || item.name;
          const topLevelFolderName = topLevelFolder.split('/')[0]; // Get the first folder name

          if (googleDriveFolders.has(topLevelFolderName)) {
            walkDirectory(fullPath, relativePath);
          }
          // Skip directories not in Google Drive (like 'resume')
        } else if (item.isFile()) {
          const fileName = item.name.toLowerCase();
          const isSyncedFile = syncedExtensions.some(ext => fileName.endsWith(ext));

          if (isSyncedFile) {
            // Check if this file exists in Google Drive (case-insensitive comparison)
            if (!googleDriveFilesLower.has(normalizedPathLower)) {
              console.log(`   ❓ File not found in Google Drive: ${relativePath}`);
              if (!dryRun) {
                try {
                  fs.unlinkSync(fullPath);
                  console.log(`   🗑️  Deleted: ${relativePath}`);
                } catch (err) {
                  console.warn(`   ⚠️  Could not delete ${relativePath}:`, err.message);
                }
              } else {
                console.log(`   📋 [DRY RUN] Would delete: ${relativePath}`);
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

    // Get all synced files (images + txt)
    const images = await reader.getSyncedFiles();
    console.log(`🖼️ Found ${images.length} synced files\n`);
    console.log(`📂 Destination: ${isDevMode ? 'public/gallery (DEV mode)' : 'docs/gallery (production)'}\n`);

    // Clean up files on disk that are no longer on Google Drive
    console.log('🧹 Cleaning up orphaned files...');
    const currentGoogleDriveFiles = new Set(images.map(img => img.path));
    await cleanupOrphanedFiles(currentGoogleDriveFiles, allFiles);

    // Track downloads
    let downloadCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    // Download images
    console.log('📥 Starting downloads...\n');

    for (const image of images) {
      const fileId = image.id;
      const filePath = image.path;

      // Prepare output path
      const outputPath = path.join(GALLERY_ROOT, filePath);

      // Check if file already exists (skip if not force redownload)
      if (!forceRedownload && fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipped: ${filePath}`);
        skippedCount++;
        continue;
      }

      try {
        if (dryRun) {
          console.log(`📋 [DRY RUN] Would download: ${filePath}`);
          const sizeStr = image.size ? ` (${(image.size / 1024 / 1024).toFixed(2)} MB)` : '';
          console.log(`           Size: ${sizeStr}`);
        } else {
          console.log(`⬇️  Downloading: ${filePath}`);
        }

        await downloadFile(reader, fileId, outputPath, image);
        downloadCount++;
      } catch (error) {
        failedCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Download Summary');
    console.log('='.repeat(50));
    console.log(`✅ Downloaded: ${downloadCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Failed: ${failedCount}`);

    if (dryRun) {
      console.log('\n(This was a DRY RUN - no files were actually downloaded)');
    }

    console.log(`\n📂 Images saved to: ${GALLERY_ROOT}`);

    return {
      downloaded: downloadCount,
      skipped: skippedCount,
      failed: failedCount
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
