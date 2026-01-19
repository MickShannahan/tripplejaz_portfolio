<script setup>
import { computed, ref } from 'vue'
import { router } from '../router'
import { Offcanvas } from 'bootstrap'

defineProps({
  logo: {
    type: String,
    required: true
  },
  routes: {
    type: Array,
    required: true
  }
})

function closeOffcanvas() {
  Offcanvas.getOrCreateInstance('#offcanvasNav')?.hide()
}

function handleNavClick() {
  closeOffcanvas()
}
</script>

<template>
  <nav class="d-md-none navbar navbar-dark bg-dark sticky-top px-4 py-2 shadow">
    <div class="container-fluid">
      <!-- Logo -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/" @click="handleNavClick">
        <img height="45" :src="logo" alt="Logo" class="drop-shadow" />
      </RouterLink>

      <!-- Hamburger Menu Button -->
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNav" aria-controls="offcanvasNav" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- Offcanvas Menu -->
    <div class="offcanvas offcanvas-end bg-dark" tabindex="-1" id="offcanvasNav"
      ref="offcanvasRef" aria-labelledby="offcanvasNavLabel">
      <div class="offcanvas-header">
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
          aria-label="Close"></button>
      </div>

      <div class="offcanvas-body d-flex flex-column justify-content-center">
        <ul class="navbar-nav gap-4">
          <li class="nav-item text-center" v-for="route in routes" :key="route.name">
            <RouterLink class="nav-link text-uppercase fs-5 fw-bold text-white"
              :to="route.path" @click="handleNavClick">
              {{ route.meta?.pageConfig?.name || route.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  z-index: 1030;
}

.drop-shadow {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));
}

.offcanvas {
  width: 100% !important;
}
</style>
