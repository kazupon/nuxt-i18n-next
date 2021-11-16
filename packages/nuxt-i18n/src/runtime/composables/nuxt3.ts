import { useI18nExtending } from './extending'
import { useI18nRoutingNuxt3 } from './routing/nuxt3'
import { useI18nHead } from './head'

import type { LocaleObject } from '@nuxtjs/i18n'

declare module 'vue-i18n' {
  interface I18n {
    localeCodes: string[]
    locales: string[] | LocaleObject[]
  }
}

export function useNuxtI18n() {
  const extending = useI18nExtending()
  const routing = useI18nRoutingNuxt3()
  const head = useI18nHead()

  return { ...extending, ...routing, ...head }
}
