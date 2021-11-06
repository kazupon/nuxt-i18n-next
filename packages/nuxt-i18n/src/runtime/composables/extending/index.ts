import { isVue2 } from '../../utils'
import { useNuxtApp } from '#app'
import { useI18nExtendingBridge } from './bridge'
import { useI18nExtendingNuxt3 } from './nuxt3'

export function useI18nExtending() {
  const { vueApp } = useNuxtApp()

  // TODO: should switch to vue-demi
  if (isVue2(vueApp.version)) {
    return useI18nExtendingBridge()
  } else {
    return useI18nExtendingNuxt3()
  }
}
