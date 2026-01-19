<script setup>
import { computed, ref, watch } from 'vue';
import { GalleryImage } from '../models/GalleryImage';

const props = defineProps({imgData: GalleryImage})
const emit = defineEmits('closeModal', 'prevImg', 'nextImg')

const thumbLoaded = ref(false)
const fullLoaded = ref(false)

watch(()=>props.imgData, (pData)=>{
  console.log('  👉👉',pData.blurHash)
  if( pData == null){
    thumbLoaded.value = false
    fullLoaded.value = false
  }
}, {deep: true})

function closeModal(){
  emit('closeModal')
}

const tallOrWide = computed(()=> props.imgData.height > props.imgData.width ? 'tall' : 'wide')


</script>


<template>
<div class="modal fade" id="gallery-modal" data-bs-scroll="true">
  <div class="modal-dialog modal-fullscreen">
    <div v-if="imgData" class="modal-content">
      
      <div class="d-flex justify-content-end justify-content-md-between position-absolute top-0 w-100" style="z-index: 999999;">
        <div class="d-none d-md-block">
          <button @click="emit('prevImg', imgData)" class="btn fs-3 bg-blur rounded"><i class="mdi mdi-arrow-left"></i></button>
          <button @click="emit('nextImg', imgData)" class="btn fs-3 bg-blur rounded"><i class="mdi mdi-arrow-right"></i></button>
        </div>
        <button class="btn fs-3 bg-blur rounded" @click="closeModal">
          <i class="mdi mdi-close"></i>
        </button>
      </div>

      <section class="d-flex align-items-center h-100">

          <!-- large image -->
          <div class="img-container">
            <div class="img-wrapper" :class="[tallOrWide]" :style="`--aspect-ratio: ${imgData.width} / ${imgData.height}`">
                <img v-if="imgData.blurHash" :width="imgData.width" :height="imgData.height" :src="imgData.blurHash" class="blurry-img" :class="{loaded: thumbLoaded}">

                <img loading="lazy" @load="thumbLoaded = true" :src="`/gallery/${imgData.thumbnailPath}`" :width="imgData.width" :height="imgData.height" class="thumb-img" :class="{loaded: thumbLoaded}" alt="thumbnail">

                <img v-if="thumbLoaded" @load="fullLoaded = true" loading="lazy" :src="`/gallery/${imgData.path}`" :alt="imgData.title" class="full-img" :class="{loaded: fullLoaded}" :width="imgData.width" :height="imgData.height">

                <!-- loader -->
                <div v-if="!fullLoaded" class="position-absolute top-0 end-0">
                  <i class="mdi mdi-loading mdi-spin fs-2"></i>
                </div>
            </div>
          </div>

          <!-- image details -->
          <!-- <section class="img-details p-3 " v-if="imageData.title || imageData.description">
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
          </section> -->

      </section>
      
      <div class="d-flex d-md-none justify-content-around">
          <button @click="emit('prevImg', imgData)" class="btn fs-1"><i class="mdi mdi-arrow-left"></i></button>
          <button @click="emit('nextImg', imgData)" class="btn fs-1"><i class="mdi mdi-arrow-right"></i></button>
      </div>


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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.img-wrapper{
  position: relative;
  overflow: hidden;
  flex-grow: 1;
  // max-height: 94dvh;
  // aspect-ratio: var(--aspect-ratio);
  &.wide img{
    width: 100%;
    height: auto;
    max-height: 94dvh;
    aspect-ratio: var(--aspect-ratio);
    margin-left: 50%;
    transform: translateX(-50%);
    object-fit: contain;
  }
  &.tall img{
    height: 94dvh;
    width: auto;
    max-width: 100%;
    aspect-ratio: var(--aspect-ratio);
    margin-left: 50%;
    transform: translateX(-50%);
    object-fit: contain;
  }

  
  
  .blurry-img{
    position: absolute;
    left: 0;
    top: 0;
    padding:  0;
    // height: auto;
    // transform: scale(1.1);
    pointer-events: none;
    &.loaded{
      opacity: 0;
      transition: opacity .2s .4s ease;
    }
  }

  
  .thumb-img{
    opacity: 0;
    &.loaded{
      opacity: 1;
      transition: opacity .2s .2s ease;
    }
  }
  


  .full-img{
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    transition: opacity .2s ease;
    &.loaded{
      opacity: 1;
    }
  }

  .mdi-load{
    // trans
  }
}

.img-fluid{
  height: 100%;
  width: 100%;
  object-fit: contain;
  object-position: center;
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