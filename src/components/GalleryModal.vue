<script setup>
import { GalleryImage } from '../models/GalleryImage';
import { getGalleryImagePath } from '../utils/pathUtils';

const {imageData} = defineProps({imageData: GalleryImage})
const emit = defineEmits('closeModal', 'prevImg', 'nextImg')

function closeModal(){
  emit('closeModal')
}
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
          <div class="h-100 d-flex justify-content-center align-items-center flex-grow-1">
            <img :src="getGalleryImagePath(imageData.path)" :alt="imageData.title" class="img-fluid p-2">
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

.img-fluid{}

.img-details{
  width: 60ch;
  p{
    font-size: 16px;
    font-weight: 400;
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.76);
  }
}
</style>