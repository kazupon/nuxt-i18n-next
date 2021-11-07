import { useI18nExtending } from './extending'
import { useI18nRoutingNuxt3 } from './routing/nuxt3'
import { useI18nHead } from './head'

export function useNuxtI18n() {
  const extending = useI18nExtending()
  const routing = useI18nRoutingNuxt3()
  const head = useI18nHead()

  return { ...extending, ...routing, ...head }
}
