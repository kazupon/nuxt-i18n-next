import { isVue2 } from '../../utils'
import { useNuxtApp } from '#app'
import { useI18nRoutingBridge } from './bridge'
import { useI18nRoutingNuxt3 } from './nuxt3'

import type { I18nRoutingOptions } from './types'

export function useI18nRouting(options: I18nRoutingOptions = {}) {
  const { vueApp } = useNuxtApp()

  // TOOD: initialize I18nRoutingOptions default value

  // TODO: should switch to vue-demi
  if (isVue2(vueApp.version)) {
    return useI18nRoutingBridge(options)
  } else {
    return useI18nRoutingNuxt3(options)
  }
}
