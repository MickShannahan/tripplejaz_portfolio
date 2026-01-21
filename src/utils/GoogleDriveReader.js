/**
 * GoogleDriveReader - Utility to read files from Google Drive
 * Uses OAuth2 Service Account authentication for secure API access
 * Works in Node.js environments (build processes, server-side)
 * 
 * For GitHub Actions, set these environment variables:
 * - GOOGLE_DRIVE_ID: Your Google Drive folder ID
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL: Service account email
 * - GOOGLE_SERVICE_ACCOUNT_KEY: Private key (multiline)
 */

import crypto from 'crypto';

class GoogleDriveReader {
  constructor(serviceAccountKey = null, folderId = null) {
    // Load from environment variables if not provided
    this.folderId = folderId || process.env.GOOGLE_DRIVE_ID

    // Build service account key from env vars or use provided object
    if (serviceAccountKey) {
      this.serviceAccountKey = serviceAccountKey;
      console.log('✅ Service account key provided as parameter');
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Handle both escaped newlines and literal newlines in environment variables
      let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      console.log('📝 Raw key from env (first 50 chars):', privateKey.substring(0, 50));
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      // Ensure key has proper format with BEGIN/END markers
      if (!privateKey.includes('BEGIN')) {
        throw new Error('Invalid private key format: missing BEGIN PRIVATE KEY marker');
      }
      this.serviceAccountKey = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey
      };
      console.log('✅ Service account key loaded from environment');
      console.log('   Email:', this.serviceAccountKey.client_email);
      console.log('   Key format OK:', this.serviceAccountKey.private_key.includes('BEGIN'));
    } else {
      console.log('❌ Missing credentials:');
      console.log('   GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ set' : '✗ missing');
      console.log('   GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? '✓ set (length: ' + process.env.GOOGLE_SERVICE_ACCOUNT_KEY.length + ')' : '✗ missing');
      this.serviceAccountKey = null;
    }

    this.accessToken = null;
    this.tokenExpiry = null;
    this.baseUrl = 'https://www.googleapis.com/drive/v3/files';
    this.tokenUrl = 'https://oauth2.googleapis.com/token';

    if (!this.folderId) {
      throw new Error(
        'Missing folder ID: Please set GOOGLE_DRIVE_ID in environment or provide folderId parameter'
      );
    }
  }

  /**
   * Load service account key from JSON object or environment variables
   * @param {Object} keyData - The service account key object (optional if env vars are set)
   */
  loadServiceAccountKey(keyData) {
    this.serviceAccountKey = keyData;
  }

  /**
   * Generate OAuth2 access token using Service Account JWT
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.serviceAccountKey) {
      throw new Error(
        'Service account key not loaded. Please provide a service account key.'
      );
    }

    try {
      const jwt = this._generateJWT();
      const token = await this._exchangeJWTForToken(jwt);

      this.accessToken = token.access_token;
      // Token expires in ~1 hour, refresh at 55 minutes
      this.tokenExpiry = Date.now() + (token.expires_in * 1000 * 0.92);

      return this.accessToken;
    } catch (error) {
      console.error('Error generating access token:', error);
      throw error;
    }
  }

  /**
   * Generate JWT assertion for OAuth2 flow
   * @private
   */
  _generateJWT() {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.serviceAccountKey.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: this.tokenUrl,
      exp: now + 3600,
      iat: now
    };

    console.log('🔐 Generating JWT with:');
    console.log('   iss:', this.serviceAccountKey.client_email);
    console.log('   key type:', typeof this.serviceAccountKey.private_key);
    console.log('   key exists:', !!this.serviceAccountKey.private_key);

    const headerEncoded = this._base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = this._base64UrlEncode(JSON.stringify(payload));
    const signature = this._signData(
      `${headerEncoded}.${payloadEncoded}`,
      this.serviceAccountKey.private_key
    );

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Exchange JWT for access token
   * @private
   */
  async _exchangeJWTForToken(jwt) {
    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    });

    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error exchanging JWT for token:', error);
      throw error;
    }
  }

  /**
   * Sign data with RSA private key
   * @private
   */
  _signData(data, privateKey) {
    try {
      if (!privateKey) {
        throw new Error('Private key is empty or undefined');
      }
      if (!privateKey.includes('BEGIN')) {
        throw new Error('Private key missing BEGIN marker - invalid format');
      }
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(data);
      const signature = sign.sign(privateKey);
      return signature.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } catch (error) {
      console.error('Signing error:', error);
      throw new Error('Failed to sign JWT: ' + error.message);
    }
  }

  /**
   * Base64 URL encode
   * @private
   */
  _base64UrlEncode(str) {
    try {
      const buffer = Buffer.from(str, 'utf-8');
      return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } catch {
      // Browser fallback
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }
  }

  /**
   * List files in a specific folder
   * @param {string} parentFolderId - The ID of the parent folder
   * @param {boolean} recursive - Whether to recursively list files in subfolders
   * @returns {Promise<Array>} Array of file objects
   */
  async listFiles(parentFolderId = this.folderId, recursive = false) {
    try {
      const files = await this._getFilesInFolder(parentFolderId);

      if (recursive) {
        return await this._listFilesRecursive(files, parentFolderId);
      }

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Get files in a specific folder (non-recursive)
   * @private
   */
  async _getFilesInFolder(folderId) {
    const accessToken = await this.getAccessToken();
    const query = `'${folderId}' in parents and trashed=false`;
    const params = new URLSearchParams({
      q: query,
      pageSize: 1000,
      fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime, size)',
      orderBy: 'name'
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error fetching files from folder:', folderId, error);
      throw error;
    }
  }

  /**
   * Recursively list all files with folder structure
   * @private
   */
  async _listFilesRecursive(files, parentFolderId, parentPath = '') {
    let allFiles = [];

    for (const file of files) {
      const filePath = parentPath ? `${parentPath}/${file.name}` : file.name;

      if (this._isFolder(file.mimeType)) {
        // Add folder to results
        allFiles.push({
          ...file,
          path: filePath,
          isFolder: true,
          children: []
        });

        // Recursively get files in subfolder
        try {
          const subFiles = await this._getFilesInFolder(file.id);
          const subFilesWithPath = await this._listFilesRecursive(subFiles, file.id, filePath);

          // Find the folder we just added and attach children
          const folderIndex = allFiles.length - 1;
          allFiles[folderIndex].children = subFilesWithPath;
        } catch (error) {
          console.warn(`Error reading subfolder ${filePath}:`, error);
        }
      } else {
        // Add file to results
        allFiles.push({
          ...file,
          path: filePath,
          isFolder: false
        });
      }
    }

    return allFiles;
  }

  /**
   * Check if a MIME type is a folder
   * @private
   */
  _isFolder(mimeType) {
    return mimeType === 'application/vnd.google-apps.folder';
  }

  /**
   * Get file download URL with authentication
   * @param {string} fileId - The Google Drive file ID
   * @returns {Promise<string>} Download URL with token
   */
  async getDownloadUrl(fileId) {
    const accessToken = await this.getAccessToken();
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${accessToken}`;
  }

  /**
   * Download a file to disk (Node.js only)
   * @param {string} fileId - The Google Drive file ID
   * @param {string} outputPath - Where to save the file
   * @returns {Promise<void>}
   */
  async downloadFile(fileId, outputPath) {
    try {
      const fs = require('fs');
      const path = require('path');
      const accessToken = await this.getAccessToken();

      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.buffer();
      const dir = path.dirname(outputPath);

      // Ensure directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Downloaded: ${outputPath}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Get a flat list of all image files
   * @returns {Promise<Array>} Array of image file objects
   */
  async getImageFiles() {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const allFiles = await this.listFiles(this.folderId, true);

    return this._filterImages(allFiles, imageExtensions);
  }

  /**
  /**
   * Filter and flatten image files from nested structure
   * @private
   */
  _filterImages(files, imageExtensions) {
    const images = [];

    const traverse = (items) => {
      for (const item of items) {
        if (item.isFolder && item.children) {
          traverse(item.children);
        } else if (!item.isFolder) {
          const fileName = item.name.toLowerCase();
          if (imageExtensions.some(ext => fileName.endsWith(ext))) {
            images.push(item);
          }
        }
      }
    };

    traverse(files);
    return images;
  }

  /**
   * Get a flat list of all synced files (images + txt)
   * @returns {Promise<Array>} Array of file objects
   */
  async getSyncedFiles() {
    const syncedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.txt'];
    const allFiles = await this.listFiles(this.folderId, true);

    return this._filterSyncedFiles(allFiles, syncedExtensions);
  }

  /**
   * Filter and flatten synced files from nested structure
   * @private
   */
  _filterSyncedFiles(files, syncedExtensions) {
    const syncedFiles = [];

    const traverse = (items) => {
      for (const item of items) {
        if (item.isFolder && item.children) {
          traverse(item.children);
        } else if (!item.isFolder) {
          const fileName = item.name.toLowerCase();
          if (syncedExtensions.some(ext => fileName.endsWith(ext))) {
            syncedFiles.push(item);
          }
        }
      }
    };

    traverse(files);
    return syncedFiles;
  }
}

export default GoogleDriveReader;
