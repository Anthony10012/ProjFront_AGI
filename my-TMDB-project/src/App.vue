<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

</script>

<template>
  <div class="nav-bar"></div>
  <div>
    <div class="page-content">
      <RouterView />
    </div>
  </div>
</template>


<style>
:root {
  --heart-size-md: 32px;
  --heart-empty: #bbbbbb;
  --heart-full: red;
}
</style>
