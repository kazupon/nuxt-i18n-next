import { useNuxtApp } from '#app'

export function useI18nRoutingBridge() {
  const {
    nuxt2Context: { app }
  } = useNuxtApp()
  const { i18n } = app

  if (!i18n) {
    throw new Error('@nuxtjs/i18n not initialized')
  }

  console.log('nuxt bridge routing composition api', app)
  return {
    switchLocalePath: app.switchLocalePath,
    localePath: app.localePath
  }
}
