import { useNuxtApp } from '#app'

import type { I18nRoutingOptions } from './types'

export function useI18nRoutingBridge(options: I18nRoutingOptions = {}) {
  const {
    nuxt2Context: { app }
  } = useNuxtApp()
  const { i18n } = app

  if (!i18n) {
    throw new Error('@nuxtjs/i18n not initialized')
  }

  console.log('nuxt bridge routing composition api', app)
  return {
    switchLocalePath: () => {
      console.log('call switchLocalePath')
    },
    localePath: () => {
      console.log('call localPath')
    }
  }
}
