import { useNuxtApp } from '#app'

import type { I18nRoutingOptions } from './types'

export function useI18nRoutingNuxt3(options: I18nRoutingOptions = {}) {
  const { $i18n } = useNuxtApp()

  if (!$i18n) {
    throw new Error('@nuxtjs/i18n not initialized in nuxt3')
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
