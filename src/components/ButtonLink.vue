<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const { link } = defineProps({
  link: String,
  text: String,
  background: String
})

const isInternalLink = computed(() => {
  if (!link) return false
  return !link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('//')
})
</script>


<template>
  <RouterLink v-if="isInternalLink" :to="link" class="router-link-button" :style="`--btn-bg-img: url(${background})`">
    <button class="btn btn-black px-4 py-3 w-100" :class="`${background ? 'bg-img': ''}`" >
      <span>
        <slot>{{ text }}</slot>
      </span>
    </button>
  </RouterLink>
  <a v-else :href="link" target="_blank" :style="`--btn-bg-img: url(${background})`">
    <button class="btn btn-black px-4 py-3 w-100" :class="`${background ? 'bg-img': ''}`" >
      <span>
        <slot>{{ text }}</slot>
      </span>
    </button>
  </a>
</template>


<style lang="scss" scoped>
  button:hover{
    background-color: var(--bs-white);
    color: var(--bs-black) !important;
  }

  a .btn.bg-img{
    height: 200px;
    background-image: linear-gradient(180deg, transparent, var(--bs-black)), var(--btn-bg-img);
    background-position: center;
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--bs-white) !important;
    filter: saturate(.75) contrast(.9) brightness(.8);
    transition: all .2s ease;
    outline: 1px solid rgba(var(--bs-light-rgb),.1);
    span{
      font-size: 20px;
      text-decoration: none;
      background-color: rgba(var(--bs-dark-rgb),.65);
      padding: .2em .75em;
      border-radius: 8px;
      backdrop-filter: blur(5px);
      border: 1px solid var(--bs-dark);
      transition: all .2s ease;
    }
    &:hover{
      filter: saturate(1);
      background-size: 115%;
    }
    &:hover span{
      filter: contrast(1) brightness(1.5);
      color: var(--bs-jazzy);
    }
  }
</style>