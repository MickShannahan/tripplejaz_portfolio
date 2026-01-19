/**
 * Test script to list files from Google Drive
 * Run this to verify the GoogleDriveReader is working correctly
 * Usage: node src/utils/testGoogleDrive.js
 * 
 * Credentials can come from:
 * 1. Environment variables (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY)
 * 2. .env file variables (loaded via dotenv or your CI/CD system)
 * 3. Fallback to joes-portfolio-account-key.json (for local development only)
 */

import GoogleDriveReader from './GoogleDriveReader.js';
import fs from 'fs';
import path from 'path';

export async function testGoogleDrive() {
  try {
    console.log('🔍 Initializing Google Drive Reader...');

    let reader;

    // Try to use environment variables first
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.log('📦 Loading credentials from environment variables');
      reader = new GoogleDriveReader();
    } else {
      // Fallback to JSON file for local development
      console.log('📦 Loading credentials from JSON file (local development)');
      const keyPath = path.resolve('./joes-portfolio-account-key.json');

      if (!fs.existsSync(keyPath)) {
        throw new Error(
          `Service account credentials not found!\n\n` +
          `For GitHub Actions, set these repository secrets:\n` +
          `  - GOOGLE_DRIVE_ID\n` +
          `  - GOOGLE_SERVICE_ACCOUNT_EMAIL\n` +
          `  - GOOGLE_SERVICE_ACCOUNT_KEY\n\n` +
          `For local development, place joes-portfolio-account-key.json in the root directory.\n` +
          `IMPORTANT: Never commit this file to git!`
        );
      }

      const serviceAccountKey = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
      reader = new GoogleDriveReader(serviceAccountKey);
    }
    console.log('✅ Reader initialized successfully');

    console.log('\n📁 Listing all files and folders (recursive)...');
    const allFiles = await reader.listFiles(reader.folderId, true);
    console.log(`✅ Found ${allFiles.length} items`);
    printFileStructure(allFiles);

    console.log('\n🖼️ Getting image files...');
    const images = await reader.getImageFiles();
    console.log(`✅ Found ${images.length} image files`);

    if (images.length > 0) {
      console.log('\nImage files:');
      images.forEach((img) => {
        const size = img.size ? `${(img.size / 1024 / 1024).toFixed(2)} MB` : 'unknown';
        console.log(`  📷 ${img.path} (${size})`);
      });
    }

    return { allFiles, images };
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Pretty print the file structure
 */
function printFileStructure(files, indent = 0) {
  files.forEach((file) => {
    const prefix = '  '.repeat(indent);
    const icon = file.isFolder ? '📁' : '📄';
    const size = file.size ? ` (${(file.size / 1024).toFixed(0)} KB)` : '';

    console.log(`${prefix}${icon} ${file.name}${size}`);

    if (file.isFolder && file.children && file.children.length > 0) {
      printFileStructure(file.children, indent + 1);
    }
  });
}

// Run test if called directly
const currentFileUrl = import.meta.url;
const isMainModule = process.argv[1] && (currentFileUrl.includes(process.argv[1]) || currentFileUrl.endsWith('testGoogleDrive.js'));

if (isMainModule) {
  testGoogleDrive().catch(console.error);
}
