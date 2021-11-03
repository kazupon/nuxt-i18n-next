import { defineNuxtPlugin } from '#app'
import { useNuxtI18n } from '#i18n'

export default defineNuxtPlugin(async nuxt => {
  const i18n = useNuxtI18n()
  console.log('nuxt', nuxt)
})
