<template>
  <div class="applications">
    <div class="row m-auto p-md-3 my-5" v-for="(app, i) in applications">
      <div class="col-lg-6 d-flex justify-content-center" :class="i % 2 == 1 ? 'offset-lg-1 order-1 order-lg-2' : ''"
        v-if="app.img">
        <img :src="app.img" :alt="app.title" class="text-shadow mb-5 mb-lg-0 rounded"
          style="width: 100%;object-fit: contain;" />
      </div>
      <div class="col-lg-4 offset-lg-1 d-flex flex-column justify-content-center">
        <h2>{{ app.title }}</h2>
        <Marked :value="app.description" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../AppState.js';

export default {
  setup() {
    return {
      applications: computed(() => AppState.applications)
    }
  }
};
</script>

<style lang="scss" scoped></style>
