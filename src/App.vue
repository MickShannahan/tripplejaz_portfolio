
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from './AppState';

const route = useRoute()
const  appState = computed(() => AppState)
const  hideNavbar = computed(() => route.meta?.hideNavbar)
const  hideFooter = computed(() => route.meta?.hideFooter)
</script>

<template>
  <Navbar v-if="!hideNavbar" />

  <main class="my-5">
    <router-view />
  </main>

  <Foot v-if="!hideFooter" />
</template>

<style lang="scss">
@import "./assets/scss/style.scss";
</style>
