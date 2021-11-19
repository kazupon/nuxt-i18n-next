<script setup lang="ts">
import Header from './components/Header.vue'
import DemoPanel from './components/DemoPanel.vue'

const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`)
}
window.addEventListener('resize', setVH)
setVH()
</script>

<template>
  <Header />
  <DemoPanel />
</template>

<style>
body {
  --tw-bg-opacity: 1;
  --base: #444;
  --nav-height: 50px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  background-color: rgba(0,30,38,var(--tw-bg-opacity));
}
.nuxt-demo {
  height: calc(var(--vh) - var(--nav-height));
}
button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
