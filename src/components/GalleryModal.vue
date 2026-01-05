<script setup>
import { ref, computed, watch } from 'vue';
import { GalleryImage } from '../models/GalleryImage';
import { getGalleryImagePath } from '../utils/pathUtils';
import { decodeBlurHash } from '../utils/imageUtils';

const {imageData} = defineProps({imageData: GalleryImage})
const emit = defineEmits('closeModal', 'prevImg', 'nextImg')

const fullImageLoaded = ref(false)
const thumbnailLoaded = ref(false)
const blurHashReady = ref(false)
const manifestLoaded = ref(false)

function closeModal(){
  emit('closeModal')
}

// Watch for changes to imageData properties
watch(() => imageData?.blurHash, (newHash) => {
  if (newHash) {
    blurHashReady.value = true
  }
}, { immediate: true })

watch(() => imageData?.thumbnailPath, (newPath) => {
  if (newPath) {
    manifestLoaded.value = true
  }
}, { immediate: true })

// Compute blurhash placeholder image
const blurHashImage = computed(() => {
  if (blurHashReady.value && imageData?.blurHash) {
    return decodeBlurHash(imageData.blurHash, 200, 150)
  }
  return null
})

// Get thumbnail or fallback to original
const thumbnailSrc = computed(() => {
  if (manifestLoaded.value && imageData?.thumbnailPath) {
    return getGalleryImagePath(imageData.thumbnailPath)
  }
  return null
})

const fullImageSrc = computed(() => {
  return getGalleryImagePath(imageData?.path)
})
</script>


<template>
<div class="modal fade" id="gallery-modal" data-bs-scroll="true">
  <div class="modal-dialog modal-fullscreen">
    <div v-if="imageData" class="modal-content">
      
      <div class="d-flex justify-content-between">
        <div>
          <button @click="emit('prevImg', imageData)" class="btn fs-3"><i class="mdi mdi-arrow-left"></i></button>
          <button @click="emit('nextImg', imageData)" class="btn fs-3"><i class="mdi mdi-arrow-right"></i></button>
        </div>
        <button class="btn btn-close fs-3" @click="closeModal"></button>
      </div>

      <section class="d-flex align-items-center h-100">
        <!-- close button -->

        <div class="d-flex flex-grow-1">
          <!-- large image -->
          <div class="img-container flex-grow-1">
            <!-- Blur hash placeholder -->
            <img 
              v-if="blurHashImage && !fullImageLoaded"
              :src="blurHashImage"
              alt="placeholder"
              class="blur-placeholder"
              aria-hidden="true"
            >

            <!-- Thumbnail (shows while full image loads) -->
            <img 
              v-if="thumbnailSrc && !fullImageLoaded"
              @load="thumbnailLoaded = true"
              :src="thumbnailSrc"
              :alt="`${imageData.title} thumbnail`"
              class="thumbnail"
              :class="{loaded: thumbnailLoaded}"
            >

            <!-- Full resolution image -->
            <img 
              @load="fullImageLoaded = true"
              :src="fullImageSrc"
              :alt="imageData.title"
              class="full-image"
              :class="{loaded: fullImageLoaded}"
            >
          </div>
          <!-- image details -->
          <section class="img-details p-3 " v-if="imageData.title || imageData.description">
            <div v-if="imageData.title">
              <b>{{ imageData.title }}</b>
              <hr class="mt-1">
            </div>
            <div v-if="imageData?.description" >
              <p>{{imageData.description}}</p>
            </div>
            <div v-if="imageData.timestamp">
              <small>{{ imageData.timeStampFormatted }}</small>
            </div>
          </section>
        </div>

      </section>

    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.modal-content{
  background-color: transparent;
  overflow: hidden;
  backdrop-filter: blur(4px);
}

.img-container {
  max-height: 94dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transition: opacity 0.3s ease;
  }

  // Blur hash placeholder - lowest layer
  .blur-placeholder {
    filter: blur(4px);
    opacity: 0.8;
    z-index: 1;
  }

  // Thumbnail - middle layer
  .thumbnail {
    opacity: 0;
    z-index: 2;
    &.loaded {
      opacity: 1;
    }
  }

  // Full image - top layer
  .full-image {
    opacity: 0;
    z-index: 3;
    &.loaded {
      opacity: 1;
    }
  }
}

.img-details{
  width: 60ch;
  p{
    font-size: 16px;
    font-weight: 400;
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.76);
  }
}
</style>