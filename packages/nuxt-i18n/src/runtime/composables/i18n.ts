import { useI18nExtending } from './extending'
import { useI18nRouting } from './routing'

export function useNuxtI18n() {
  const extending = useI18nExtending()
  const routing = useI18nRouting()

  return { ...extending, ...routing }
}
