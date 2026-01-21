import { GalleryImage } from "./GalleryImage.js";


export class GalleryProject extends GalleryImage {
  constructor(data, images = [], markdown = '') {
    super(data)
    this.projectImages = images
    this.projectMarkdownRaw = markdown
  }
}