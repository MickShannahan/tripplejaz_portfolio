<script setup>
import { computed, ref } from 'vue';
import FancyImage from './FancyImage.vue';
import GalleryModal from './GalleryModal.vue';

const {galleryImgs, galleryType, rows, columnSize, auto, interval} = defineProps({
  galleryImgs: {type: Array, required: true},
  galleryType: {type: String, default: 'columns'},
  rows: {type: Number, default: 3},
  columnSize: {type: Number, default: 300}, 
  aspectRatio: {type: String, default: 'auto'},
  auto: {type: Boolean, default: true},
  interval: {type: Number, default: 5}
})
const intervalMs = computed(() => interval * 1000)
const colSize = computed(()=> columnSize + 'px')
const carouselId = ref(`carousel-${Math.random().toString(36).substr(2, 9)}`)

</script>


<template>
<div class="gallery-box" :class="galleryType">
  <!-- Columns and Grid layouts -->
  <template v-if="galleryType !== 'carousel'">
    <FancyImage v-for="(imgData, position) in galleryImgs" :imgData="imgData" :position="position"/>
  </template>

  <!-- Carousel layout -->
  <div v-else class="carousel-container">
    <div :id="carouselId" class="carousel slide" :data-bs-ride="auto ? 'carousel' : 'false'" :data-bs-interval="intervalMs">
      <div class="carousel-indicators">
        <button 
          v-for="(_, index) in galleryImgs" 
          :key="index"
          type="button" 
          :data-bs-target="`#${carouselId}`" 
          :data-bs-slide-to="index"
          :class="index === 0 ? 'active' : ''"
          :aria-current="index === 0"
          :aria-label="`Slide ${index + 1}`">
        </button>
      </div>
      <div class="carousel-inner">
        <div 
          v-for="(imgData, index) in galleryImgs" 
          :key="index"
          :class="['carousel-item', index === 0 ? 'active' : '']">
          <FancyImage :imgData="imgData" class="d-block w-100"/>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" :data-bs-target="`#${carouselId}`" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" :data-bs-target="`#${carouselId}`" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</div>

<GalleryModal>

</GalleryModal>
</template>


<style lang="scss">
  .gallery-box{
    --column-count: v-bind(rows);
    --column-attempt-size: v-bind(colSize);
    --image-spacing: 10px;
    --image-border-radius: 0px;
    margin: 1em 1em;
  }

.gallery-box.columns{
  columns: var(--column-count) var(--column-attempt-size);
  gap: var(--image-spacing);
  &>*{
    margin-bottom: var(--image-spacing);
    border-radius: var(--image-border-radius);
  }
}

.gallery-box.grid{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--column-attempt-size), 1fr));
  gap: var(--image-spacing);
  &>* img{
    width: 100%;
    aspect-ratio: v-bind(aspectRatio);
    object-fit: cover;
  }
}

.gallery-box.carousel {
  .carousel-container {
    width: 100%;
    max-width: 100%;
  }

  .carousel {
    border-radius: var(--image-border-radius);
  }

  .carousel-item {
    img {
      aspect-ratio: v-bind(aspectRatio);
      object-fit: cover;
    }
  }
}

</style>