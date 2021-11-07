import { useI18nExtending } from './extending'
import { useI18nRoutingBridge } from './routing/bridge'
import { useI18nHead } from './head'

export function useNuxtI18n() {
  const extending = useI18nExtending()
  const routing = useI18nRoutingBridge()
  const head = useI18nHead()

  return { ...extending, ...routing, ...head }
}
