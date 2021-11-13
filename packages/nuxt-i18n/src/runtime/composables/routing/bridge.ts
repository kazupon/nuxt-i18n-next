import { useNuxtApp } from '#app'

import type { I18nRoutingOptions } from './types'

export function useI18nRoutingBridge(options: I18nRoutingOptions = {}) {
  const {
    nuxt2Context: { $i18n }
  } = useNuxtApp()

  if (!$i18n) {
    throw new Error('@nuxtjs/i18n not initialized in nuxt bridge')
  }

  return {
    i18n: $i18n,
    switchLocalePath: () => {
      console.log('call switchLocalePath')
    },
    localePath: () => {
      console.log('call localPath')
    }
  }
}
