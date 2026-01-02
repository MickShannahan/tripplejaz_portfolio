import { getGalleryImagePath } from '../utils/pathUtils';

export class GalleryImage {
  constructor({ path = '', title, description }) {
    this.path = path
    this.name = path.slice(path.lastIndexOf('/') + 1)
    this.title = title
    this.description = description || ''
    this.height
    this.width
    this.timestamp = null
    this.loadImg()
  }

  async loadImg() {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.width = img.naturalWidth
        this.height = img.naturalHeight
        this.timestamp = img.lastModified ? new Date(img.lastModified) : null
        resolve()
      }
      img.onerror = reject
      img.src = getGalleryImagePath(this.path)
    })
  }

  get timeStampFormatted() {
    return this.timestamp.toLocaleDateString()
  }
}