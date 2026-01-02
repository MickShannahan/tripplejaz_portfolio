<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { router } from '../router'

defineProps({
  logo: {
    type: String,
    required: true
  }
})

const scrolled = ref(window.scrollY > 100)

function onScroll() {
  scrolled.value = window.scrollY > 100
}

const routes = computed(() => {
  return router.getRoutes().filter(route => route.path !== '/:pathMatch(.*)*')
})

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

</script>

<template>
  <nav class="navbar  transition d-none d-md-flex justify-content-center pt-4">
        <!-- Logo -->
         <div class="nav-container">
           <RouterLink class="navbar-brand" to="/">
             <img :src="logo" alt="Logo" class="img-fluid" />
            </RouterLink>
          </div>
    </nav>
        <!-- Desktop Nav Links -->
    <nav class="sticky-top container-fluid d-none d-md-flex justify-content-center p-3" :class="scrolled ? 'bg-body drop-shadow' : 'bg-transparent'">
        <ul class="navbar-nav d-flex flex-row flex-wrap justify-content-center">
          <li class="nav-item" v-for="route in routes" :key="route.name">
            <RouterLink class="nav-link text-lowercase " :to="route.path">
              {{ route.name }}
            </RouterLink>
          </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
.nav-container{
  width: 420px;
}

.navbar {
  transition: all 0.35s linear;
  z-index: 1030;
}

.drop-shadow {
  filter: drop-shadow(0 8px 4px rgba(0, 0, 0, 0.2));
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
