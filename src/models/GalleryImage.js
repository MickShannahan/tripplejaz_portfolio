export class GalleryImage {
  constructor({ path, title, description }) {
    this.path = path
    this.title = title || path
    this.description = description || ''
    this.height
    this.width
    this.loadImg()
  }

  async loadImg() {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.width = img.naturalWidth
        this.height = img.naturalHeight
        resolve()
      }
      img.onerror = reject
      img.src = '/gallery/' + this.path
    })
  }
}