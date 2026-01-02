<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const { link } = defineProps({
  link: String,
  text: String
})

const isInternalLink = computed(() => {
  if (!link) return false
  return !link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('//')
})
</script>


<template>
  <RouterLink v-if="isInternalLink" :to="link" class="router-link-button">
    <button class="btn btn-black px-4 py-3">
      <slot>{{ text }}</slot>
    </button>
  </RouterLink>
  <a v-else :href="link" target="_blank">
    <button class="btn btn-black px-4 py-3">
      <slot>{{ text }}</slot>
    </button>
  </a>
</template>


<style lang="scss" scoped>
  button:hover{
    background-color: var(--bs-white);
    color: var(--bs-black) !important;
  }
</style>