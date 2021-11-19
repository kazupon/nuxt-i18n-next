<script setup lang="ts">
import Sun from './icons/Sun.vue'
import Moon from './icons/Moon.vue'

function toggleDark() {
  const cls = document.documentElement.classList
  cls.toggle('dark')
  localStorage.setItem(
    'nuxt-i18n-next-prefer-dark',
    String(cls.contains('dark'))
  )
}
</script>

<template>
  <nav>
    <h1>@nuxt/i18n next demo</h1>
    <div class="links">
      <button title="Toggle dark mode" class="toggle-dark" @click="toggleDark">
        <Sun class="light" />
        <Moon class="dark" />
      </button>
    </div>
  </nav>
</template>

<style>
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;
  color: var(--base);
  height: var(--nav-height);
  box-sizing: border-box;
  padding: 0 1em;
  background-color: var(--bg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.33);
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}

.dark nav {
  --tw-bg-opacity: 1;
  --base: #ddd;
  --bg: rgba(0,30,38,var(--tw-bg-opacity));
  --bg-light: #242424;
  --border: rgba(0,30,38,var(--tw-bg-opacity));
  box-shadow: none;
  border-bottom: 1px solid var(--border);
}

h1 {
  margin: 0;
  line-height: var(--nav-height);
  font-weight: 500;
  display: inline-block;
  vertical-align: middle;
}

.links {
  display: flex;
}

.toggle-dark svg {
  width: 18px;
  height: 18px;
  fill: #666;
}

.toggle-dark .dark,
.dark .toggle-dark .light {
  display: none;
}

.dark .toggle-dark .dark {
  display: inline-block;
}

@media (max-width: 560px) {
  h1 span {
    font-size: 0.9em;
  }
}
@media (max-width: 480px) {
  h1 span {
    display: none;
  }
}
</style>
