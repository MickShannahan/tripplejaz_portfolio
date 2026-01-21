<script setup>
import { computed, ref, watch } from 'vue';
import { GalleryImage } from '../models/GalleryImage';
import { GalleryProject } from '../models/GalleryProject';

const props = defineProps({imgData: GalleryImage, id: { type: String, default: ''}})
const emit = defineEmits('closeModal', 'prevImg', 'nextImg')

const thumbLoaded = ref(false)
const fullLoaded = ref(false)
const projectDescription = ref([])
const isProject = computed(()=> props.imgData instanceof GalleryProject)

watch(()=>props.imgData, (pData)=>{
  console.log('  👉👉', pData?.blurHash)
  if( pData == null){
    thumbLoaded.value = false
    fullLoaded.value = false
    projectDescription.value = []
  }
  if(isProject.value){
    const projName = props.imgData.path.slice(0, props.imgData.path.lastIndexOf('/'))
    console.log(projName)
    getProjectMarkdown(projName)
  }
}, {deep: true})

function closeModal(){
  emit('closeModal')
}

const tallOrWide = computed(()=> props.imgData.height > props.imgData.width ? 'tall' : 'wide')

async function getProjectMarkdown(projectName){
  const response = await fetch(`/gallery/${projectName}/description.txt`)
  if(response.statusText != 'OK' ) return null
  const data = await response.text()
  if(data.startsWith('<!DOCTYPE html>')) return null
  const descText = data.split('---')
  projectDescription.value = descText
}

</script>


<template>
<div class="modal fade" :id="`gallery-modal${id}`" data-bs-scroll="true">
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
           <template v-if="!isProject">
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
          </template>


          <template v-else>
              <section class="project-container">

                <div v-for="(img, i) in imgData.projectImages" class="img-container">
                <div  class="img-wrapper" :class="[tallOrWide]" :style="`--aspect-ratio: ${img.width} / ${img.height}`">
                  <img v-if="img.blurHash" :width="img.width" :height="img.height" :src="img.blurHash" class="blurry-img" :class="{loaded: thumbLoaded}">
                  <img loading="lazy" @load="thumbLoaded = true" :src="`/gallery/${img.thumbnailPath}`" :width="img.width" :height="img.height" class="thumb-img" :class="{loaded: thumbLoaded}" alt="thumbnail">
                  <img v-if="thumbLoaded" @load="fullLoaded = true" loading="lazy" :src="`/gallery/${img.path}`" :alt="img.title" class="full-img" :class="{loaded: fullLoaded}" :width="img.width" :height="img.height">

                  <div v-if="!fullLoaded" class="position-absolute top-0 end-0">
                    <i class="mdi mdi-loading mdi-spin fs-2"></i>
                  </div>
                  <article>{{ projectDescription[i] }}</article>
                </div>
                </div>

              </section>
          </template>


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

.project-container{
  width: 100%;
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow-y: auto;
  .img-wrapper.wide img{
    max-height: 86dvh;
  }
  .img-wrapper.tall img{
    height: 86dvh;
  }
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

  article{
    text-align: center;
    margin-top: .25em;
    margin-bottom: -.25em;
    max-width: 65ch;
    margin-inline: auto;
    opacity: .9;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.473);
    // position: absolute;
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