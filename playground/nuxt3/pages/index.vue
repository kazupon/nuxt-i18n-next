<template>
  <div>
    <h1>{{ t('welcome') }}</h1>
    <h3>{{ t('hello', { name: 'Nuxt' }) }}</h3>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const app = useNuxtApp()

console.log('app', app)
</script>

