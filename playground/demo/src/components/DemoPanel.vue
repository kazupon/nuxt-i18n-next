<script setup lang="ts">
import SplitPanel from './SplitPanel.vue'
import Page from './Page.vue'
</script>

<template>
  <div class="nuxt-demo">
    <SplitPanel>
      <template #left>
        <Page class="nuxt-bridge" url="http://localhost:3000" name="bridge" />
      </template>
      <template #right>
        <Page class="nuxt3" url="http://localhost:3003" name="nuxt3" />
      </template>
    </SplitPanel>
  </div>
</template>

<style scoped>
.nuxt-demo {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  overflow: hidden;
  background-color: var(--bg-soft);
}
.dark .nuxt-demo {
  --bg: #1a1a1a;
  --bg: rgba(0,53,67,var(--tw-bg-opacity));
  --bg-soft: rgba(0,53,67,var(--tw-bg-opacity));
  --border: rgba(0,30,38,var(--tw-bg-opacity));
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}
:deep(button) {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>