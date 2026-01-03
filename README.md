# Client Guide: Managing Your Portfolio

Welcome! This guide will help you add new pages, create galleries, and manage your portfolio content without needing extensive coding knowledge.

---

## 📚 Table of Contents

1. [Understanding the Basics](#understanding-the-basics)
2. [Adding New Pages](#adding-new-pages)
3. [Working with Gallery Images](#working-with-gallery-images)
4. [Creating Gallery Boxes](#creating-gallery-boxes)
5. [Customizing Gallery Layouts](#customizing-gallery-layouts)
6. [Code Templates](#code-templates)

---

## Understanding the Basics

### What is Vue and Why Do We Use HTML?

This portfolio uses **Vue**, a JavaScript framework that makes it easy to create dynamic web pages. In Vue files, you'll see two main sections:

- **Template** (HTML): This is what visitors see in their browser. HTML uses tags (like `<div>`, `<h1>`, `<img>`) to structure content.
- **Script Setup** (JavaScript): This is the "logic" that controls how the template works and manages data.

### HTML Tags Explained

HTML tags are instructions that tell the browser how to display content. They look like: `<tagname>content</tagname>`

Common tags you'll use:
- `<h1>`, `<h2>`, `<h3>`: Headings (h1 is largest, h3 is smallest)
- `<div>`: A container to group content
- `<section>`: Defines a section of content
- `<article>`: Defines an article or distinct piece of content
- `<img>`: Displays an image
- `<a>`: Creates a clickable link

In Vue, HTML tags can accept **props** (properties) that control their behavior. You'll see them like: `<ComponentName :propName="value"/>`

---

## Adding New Pages

### How It Works

The router automatically discovers pages in the `src/pages/` folder. Pages must:
1. Be named with a **number prefix** (e.g., `01_`, `02_`, etc.) to control their order
2. Use an underscore or dash to separate words (e.g., `01_My_Page` or `01-My-Page`)
3. Be `.vue` files

The router converts these to readable URL paths:
- `01_Paintings.vue` → "Paintings" page at `/#/paintings`
- `02_Concept_Art.vue` → "Concept Art" page at `/#/concept-art`

### Step-by-Step: Creating a New Page

#### Step 1: Create the Vue File
Create a new file in `src/pages/` with a number prefix. For example: `05_My_New_Page.vue`

#### Step 2: Use the Template Below
Copy this basic template and save it as your new page file:

```vue
<script setup>
import { useHead } from '@unhead/vue';
import { AppState } from '../AppState';

useHead({
  title: AppState.baseSiteTitle + ' | My New Page',
  meta: [{ property: '', content: '' }],
  htmlAttrs: {'data-bs-theme': 'dark'}
})
</script>

<template>
  <section class="container my-4">
    <h1>My New Page</h1>
    <p>Add your content here!</p>
  </section>
</template>

<style lang="scss" scoped>
/* Your custom styles here */
</style>
```

#### Step 3: Customize
- Change `My New Page` to your page title
- Change the content in the `<template>` section
- Add your own HTML and styling

#### Step 4: It's Live!
The page automatically appears in the navigation menu and is accessible by the URL path.

---

## Working with Gallery Images

### Understanding the GalleryImage Class

The `GalleryImage` class is a special tool that manages image data. Here's what it does:

1. **Takes an image path** from the `public/gallery/` folder
2. **Loads the image** and automatically detects its width and height
3. **Stores metadata** like title and description
4. **Makes the image ready to display** in gallery components

### The Relationship: Public Folder → Gallery Images → Display

```
Public Folder (where files live)
  └── gallery/
      ├── paintings/
      │   ├── image1.webp
      │   └── image2.webp
      └── resume/
          └── project_images/

             ↓ (referenced in your page file)

Gallery Image Objects (created in your Vue file)
  └── new GalleryImage({path: 'paintings/image1.webp'})
      └── Automatically loads image data (width, height)

             ↓ (passed to the component)

Gallery Box Component
  └── Displays images beautifully in your chosen layout
```

### Creating GalleryImage Objects

In your page file's `<script setup>` section, create image objects like this:

```javascript
import { GalleryImage } from '../models/GalleryImage';

const myGalleryImages = [
  new GalleryImage({
    path: 'paintings/my_image.webp'
  }),
  new GalleryImage({
    path: 'paintings/another_image.webp'
  })
]
```

**Important:** The `path` is relative to the `public/gallery/` folder. So if your image is at `public/gallery/paintings/my_image.webp`, the path is `'paintings/my_image.webp'`.

### Adding Titles and Descriptions (Optional)

You can add more information to your images:

```javascript
const galleryImages = [
  new GalleryImage({
    path: 'paintings/portrait.webp',
    title: 'Portrait Series',
    description: 'A beautiful portrait exploring light and shadow'
  })
]
```

---

## Creating Gallery Boxes

### What is a GalleryBox?

A `GalleryBox` is a Vue component that displays multiple images in a beautiful layout. It handles:
- Image organization and display
- Click-to-enlarge modals (popup windows)
- Navigation between images
- Different layout styles

### Basic Gallery Box

Here's the simplest way to create a gallery:

```vue
<script setup>
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';

const galleryImages = [
  new GalleryImage({ path: 'paintings/image1.webp' }),
  new GalleryImage({ path: 'paintings/image2.webp' }),
  new GalleryImage({ path: 'paintings/image3.webp' })
]
</script>

<template>
  <GalleryBox :galleryImgs="galleryImages" />
</template>
```

**Note:** `:galleryImgs` is a "prop" (property) that tells the GalleryBox which images to display. The colon (`:`) tells Vue that this is a variable, not plain text.

---

## Customizing Gallery Layouts

### Gallery Types

The `GalleryBox` component supports three different layouts:

#### 1. **Columns Layout** (Default - Masonry Style)
Images flow like a magazine with multiple columns. Perfect for irregular image sizes.

```vue
<GalleryBox :galleryImgs="galleryImages" galleryType="columns" :rows="3" />
```

**Properties:**
- `galleryType="columns"` → Activates columns mode
- `:rows="3"` → Number of columns (3, 2, or 4 are common)
- `:columnSize="300"` → Minimum column width in pixels (default: 300px)

#### 2. **Grid Layout**
Images display in a uniform grid. Perfect when you want consistent sizing.

```vue
<GalleryBox 
  :galleryImgs="galleryImages" 
  galleryType="grid"
  :rows="3"
  :columnSize="250"
  aspectRatio="1 / 1"
/>
```

**Properties:**
- `galleryType="grid"` → Activates grid mode
- `:rows="3"` → Number of columns
- `:columnSize="250"` → Minimum cell size in pixels
- `aspectRatio="1 / 1"` → Image aspect ratio (1/1 = square, 16/9 = widescreen, 4/3 = standard)

#### 3. **Carousel Layout** (Slider)
Images display one at a time with navigation arrows and indicators. Great for featured work.

```vue
<GalleryBox 
  :galleryImgs="galleryImages" 
  galleryType="carousel"
  :auto="true"
  :interval="5"
/>
```

**Properties:**
- `galleryType="carousel"` → Activates carousel mode
- `:auto="true"` → Auto-scroll between images (set to `false` to disable)
- `:interval="5"` → Time between slides in seconds (5 = 5 seconds)

### Complete Props Reference

Here's every property you can customize:

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `galleryImgs` | Array | Required | The array of GalleryImage objects to display |
| `galleryType` | String | `'columns'` | Layout type: `'columns'`, `'grid'`, or `'carousel'` |
| `rows` | Number | `3` | Number of columns for columns/grid layouts |
| `columnSize` | Number | `300` | Minimum width for columns/cells in pixels |
| `aspectRatio` | String | `'auto'` | Image aspect ratio for grid (e.g., `'16/9'`, `'1/1'`, `'4/3'`) |
| `auto` | Boolean | `true` | For carousel: auto-scroll enabled |
| `interval` | Number | `5` | For carousel: seconds between slides |

### Example: Multiple Galleries on One Page

You can have multiple galleries with different layouts on the same page:

```vue
<script setup>
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';

const paintingsGallery = [
  new GalleryImage({ path: 'paintings/work1.webp' }),
  new GalleryImage({ path: 'paintings/work2.webp' })
]

const projectsGallery = [
  new GalleryImage({ path: 'resume/project1.webp' }),
  new GalleryImage({ path: 'resume/project2.webp' })
]
</script>

<template>
  <section class="container my-4">
    <h1>My Paintings</h1>
    <GalleryBox :galleryImgs="paintingsGallery" galleryType="columns" :rows="2" />
  </section>

  <section class="container my-4">
    <h1>Project Showcase</h1>
    <GalleryBox :galleryImgs="projectsGallery" galleryType="carousel" :auto="false" />
  </section>
</template>
```

---

## Code Templates

### Template 1: Simple Gallery Page

Copy and paste this to create a basic gallery page:

```vue
<script setup>
import { useHead } from '@unhead/vue';
import { AppState } from '../AppState';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';

useHead({
  title: AppState.baseSiteTitle + ' | Gallery Name',
  meta: [{ property: '', content: '' }],
  htmlAttrs: {'data-bs-theme': 'dark'}
})

const galleryImages = [
  new GalleryImage({ path: 'folder_name/image1.webp' }),
  new GalleryImage({ path: 'folder_name/image2.webp' }),
  new GalleryImage({ path: 'folder_name/image3.webp' })
]
</script>

<template>
  <section class="container my-4">
    <h1>Gallery Name</h1>
    <GalleryBox :galleryImgs="galleryImages" galleryType="columns" :rows="3" />
  </section>
</template>

<style lang="scss" scoped>
/* Add custom styles here if needed */
</style>
```

**To use:**
1. Copy the entire code above
2. Create a new file: `src/pages/XX_Your_Page_Name.vue` (replace XX with the next number)
3. Paste the code
4. Change:
   - `Gallery Name` to your title
   - `folder_name` to your image folder name (inside `public/gallery/`)
   - `image1.webp`, etc. to your actual image filenames
   - Adjust `galleryType` and `:rows` as needed

### Template 2: Multi-Section Page (Like Resume)

Copy this for a page with multiple galleries:

```vue
<script setup>
import { useHead } from '@unhead/vue';
import { AppState } from '../AppState';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';

useHead({
  title: AppState.baseSiteTitle + ' | Portfolio',
  meta: [{ property: '', content: '' }],
  htmlAttrs: {'data-bs-theme': 'dark'}
})

const section1Images = [
  new GalleryImage({ path: 'folder1/image1.webp' }),
  new GalleryImage({ path: 'folder1/image2.webp' })
]

const section2Images = [
  new GalleryImage({ path: 'folder2/image1.webp' }),
  new GalleryImage({ path: 'folder2/image2.webp' })
]
</script>

<template>
  <section class="container my-4">
    <article>
      <h2>Section 1 Title</h2>
      <p>Add description or details about this section</p>
      <GalleryBox :galleryImgs="section1Images" galleryType="carousel" />
    </article>

    <article>
      <h2>Section 2 Title</h2>
      <p>Add description or details about this section</p>
      <GalleryBox :galleryImgs="section2Images" galleryType="carousel" />
    </article>
  </section>
</template>

<style lang="scss" scoped>
article {
  margin: 3rem 0rem;
}
</style>
```

---

## FAQ

**Q: How do I add an image to the portfolio?**
A: Add your image file to the appropriate folder in `public/gallery/` (e.g., `public/gallery/paintings/`), then create a `GalleryImage` object with the path in your page file.

**Q: Can I reorder pages?**
A: Yes! Change the number prefix. For example, rename `05_My_Page.vue` to `02_My_Page.vue` to move it up.

**Q: What image formats work best?**
A: WebP format is best for web (smaller file size, faster loading). JPG and PNG also work.

**Q: Can I have different gallery layouts on the same page?**
A: Yes! Create multiple GalleryBox components with different `galleryType` and props.

**Q: What if my images don't load?**
A: Make sure the image path is correct. The path should be relative to `public/gallery/`. If your image is at `public/gallery/paintings/my_pic.webp`, use `path: 'paintings/my_pic.webp'`.