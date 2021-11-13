<template>
  <div>
    <h1>{{ t('welcome') }}</h1>
    <h3>{{ t('hello', { name: 'Nuxt' }) }}</h3>
    <form>
      <select id="locale-select" v-model="locale">
        <template  v-for="(code) in i18n.localeCodes">
          <option :value="code">{{ code }}</option>
        </template>
      </select>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNuxtI18n } from '#i18n'

const { t, locale } = useI18n()
const { switchLocalePath, i18n, localePath } = useNuxtI18n()

console.log('localPath', localePath('/', 'fr'))
console.log('localeCodes', i18n.localeCodes)  
</script>

