<script setup>
import { ref, computed, onMounted } from 'vue';
import { GalleryImage } from '../models/GalleryImage';
import { getGalleryImagePath } from '../utils/pathUtils';

const {imgData, position} = defineProps({
  imgData : {type: GalleryImage, required: true},
  position: Number
})

const emit = defineEmits('imgClicked')

const thumbLoaded = ref(false)
const fullLoaded = ref(false)

onMounted(()=>{
  setTimeout(forceLoadFull, 2000)
})

function setActiveImage(){
  emit('imgClicked', imgData)
}

// Thumbnail path computed
const thumbnailPath = computed(() => {
  return imgData?.thumbnailPath ? getGalleryImagePath(imgData.thumbnailPath) : null
})

// Full image path computed
const fullImagePath = computed(() => {
  return getGalleryImagePath(imgData?.path)
})

function handleThumbLoaded(){
  console.log('🖼️thumb loaded', imgData.thumbnailPath)
  thumbLoaded.value =true
}

function forceLoadFull(){
  if(!thumbLoaded.value){
    console.log('forced load of full res')
    thumbLoaded.value = true
  }
}


</script>


<template>
<div @click="setActiveImage" class="img-wrapper" :style="`--w: ${imgData.width}px; --h: ${imgData.height}px; --pos: ${position || 1}`">

  <img  loading="lazy" @load="handleThumbLoaded = true" :src="thumbnailPath" :alt="imgData.title" class="thumb-img" :class="{thumbLoaded, fullLoaded}" :width="imgData.width" :height="imgData.height">

  <img v-if="thumbLoaded" loading="lazy" @load="fullLoaded = true" :src="fullImagePath" :alt="imgData.title" class="full-img" :class="{fullLoaded}" :width="imgData.width" :height="imgData.height">

</div>
</template>


<style lang="scss" scoped>
.img-wrapper{
  position: relative;
  overflow: hidden;
  
  img{
    object-fit: contain;
    width: 100%;
    height: auto;
    transition: all .2s calc(.025s * var(--pos)) ease;
  }
  .thumb-img{
    transform: translateY(102%);
  }
  
  .thumb-img.thumbLoaded{
    transform: translate(0%);
  }

  .thumb-img.fullLoaded{
    // opacity: 0;
    // position: absolute;
    // z-index: -1;
  }

  .full-img{
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: all .5s ease;
  }

  .full-img.fullLoaded{
    opacity: 1;
  }
  
  img:hover{
    transform: scale(1.05);
    cursor: zoom-in;
  }
}
</style>
