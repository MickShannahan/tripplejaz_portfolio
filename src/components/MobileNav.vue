<script setup>
import { computed, ref } from 'vue'
import { router } from '../router'

defineProps({
  logo: {
    type: String,
    required: true
  }
})

const offcanvasRef = ref(null)
const showOffcanvas = ref(false)

const routes = computed(() => {
  return router.getRoutes().filter(route => route.path !== '/:pathMatch(.*)*')
})

function closeOffcanvas() {
  showOffcanvas.value = false
  // Close Bootstrap offcanvas if it exists
  const offcanvasElement = offcanvasRef.value
  if (offcanvasElement) {
    const offcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement)
    if (offcanvas) {
      offcanvas.hide()
    }
  }
}

function handleNavClick() {
  closeOffcanvas()
}
</script>

<template>
  <nav class="navbar navbar-dark bg-dark fixed-top px-4 py-3">
    <div class="container-fluid">
      <!-- Logo -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/" @click="handleNavClick">
        <img height="45" :src="logo" alt="Logo" class="drop-shadow" />
        <p class="fs-5 m-0 ms-2 text-primary">
          TripleJaz
        </p>
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
      <div class="offcanvas-header border-bottom border-secondary">
        <h5 class="offcanvas-title text-white" id="offcanvasNavLabel">Menu</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
          aria-label="Close"></button>
      </div>

      <div class="offcanvas-body d-flex flex-column justify-content-center">
        <ul class="navbar-nav gap-4">
          <li class="nav-item text-center" v-for="route in routes" :key="route.name">
            <RouterLink class="nav-link text-uppercase fs-5 fw-bold text-white"
              :to="route.path" @click="handleNavClick">
              {{ route.name }}
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
