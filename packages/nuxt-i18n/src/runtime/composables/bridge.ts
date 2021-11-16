import { useI18nExtending } from './extending'
import { useI18nRoutingBridge } from './routing/bridge'
import { useI18nHead } from './head'

import type { LocaleObject } from '@nuxtjs/i18n'
import type { Route } from 'vue-router3'

declare module 'vue-i18n-bridge' {
  interface I18n {
    locale: string
    defaultLocale: string
    localeCodes: string[]
    locales: string[] | LocaleObject[]
    setLocale: (locale: string) => void
    __onNavigate: (route: Route) => void
  }
}

export function useNuxtI18n() {
  const extending = useI18nExtending()
  const routing = useI18nRoutingBridge()
  const head = useI18nHead()

  return { ...extending, ...routing, ...head }
}
