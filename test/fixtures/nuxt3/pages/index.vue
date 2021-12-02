<template>
  <div>
    <h1>Nuxt3</h1>
    <h2>{{ t('welcome') }}</h2>
    <h3>{{ t('hello', { name: '@nuxt/i18n next on Nuxt 3' }) }}</h3>
    <form>
      <select id="locale-select" v-model="locale">
        <template  v-for="(code) in i18n.localeCodes">
          <option :value="code">{{ code }}</option>
        </template>
      </select>
    </form>
    <span v-for="locale in availableLocales" :key="locale.code">
      <NuxtLink :to="switchLocalePath(locale.code) || ''">{{ locale.name }}</NuxtLink> |
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNuxtI18n } from '#i18n'

const { t, locale } = useI18n({ useScope: 'global' })
const { switchLocalePath, i18n, localePath } = useNuxtI18n()

console.log('localPath', localePath('/', 'fr'))
console.log('localeCodes', i18n.localeCodes)  
console.log('locales', i18n.locales)  
const availableLocales = computed(() => {
  return i18n.locales.filter(i => i.code !== i18n.global.locale.value)
})
</script>

