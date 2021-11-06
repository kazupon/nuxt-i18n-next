import { isVue2 } from '../../utils'
import { useNuxtApp } from '#app'
import { useI18nRoutingBridge } from './bridge'
import { useI18nRoutingNuxt3 } from './nuxt3'

export function useI18nRouting() {
  const { vueApp } = useNuxtApp()

  // TODO: should switch to vue-demi
  if (isVue2(vueApp.version)) {
    return useI18nRoutingBridge()
  } else {
    return useI18nRoutingNuxt3()
  }
}
