<script setup>
import { ref, computed, onMounted } from 'vue';
import { GalleryImage } from '../models/GalleryImage';
import { getGalleryImagePath } from '../utils/pathUtils';

const {imgData} = defineProps({
  imgData : {type: GalleryImage, required: true},
  position: Number
})

const emit = defineEmits('imgClicked')

const thumbLoaded = ref(false)
const fullLoaded = ref(false)


function setActiveImage(){
  emit('imgClicked', imgData)
}


</script>


<template>
<div @click="setActiveImage" class="img-wrapper" :style="`--w: ${imgData.width}px; --h: ${imgData.height}px; --pos: ${position || 1}`">

  <img v-if="imgData.blurHash" :width="imgData.width" :height="imgData.height" :src="imgData.blurHash" class="blurry-img">

  <img loading="lazy" @load="thumbLoaded = true" :src="`/gallery/${imgData.thumbnailPath}`" :width="imgData.width" :height="imgData.height" class="thumb-img" :class="{loaded: thumbLoaded}" alt="thumbnail">

  <img v-if="thumbLoaded" @load="fullLoaded = true" loading="lazy" :src="`/gallery/${imgData.path}`" :alt="imgData.title" class="full-img" :class="{loaded: fullLoaded}" :width="imgData.width" :height="imgData.height">

</div>
</template>


<style lang="scss" scoped>
.img-wrapper{
  position: relative;
  overflow: hidden;

  
  img{
    transform: scale(1);
    transition: all .2s ease;
  }
  
  &:hover img{
    transform: scale(1.1) !important;
    filter: brightness(1.1);
    cursor: zoom-in;
  }
  
  .blurry-img{
    width: 100%;
    height: 100%;
    position: absolute;
    // height: auto;
    transform: scale(1.1) translateY(102%);
    animation: slide-in .2s calc( .025s * var(--pos)) ease forwards;
    pointer-events: none;
  }
  
  .thumb-img{
    width: 100%;
    height: auto;
    opacity: 0;
    &.loaded{
      opacity: 1;
      transition: all .2s .2s ease;
    }
  }
  


  .full-img{
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all .2s ease;
    &.loaded{
      opacity: 1;
    }
  }

  @keyframes slide-in{
    0%{
    transform: scale(1.1)  translateY(102%);
    }
    100%{
    transform: scale(1.1) translateY(0%);
    }
  }

}
</style>
