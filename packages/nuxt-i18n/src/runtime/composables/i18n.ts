import { useI18nRouting } from './routing'

export function useNuxtI18n() {
  const routing = useI18nRouting()

  return { ...routing }
}
