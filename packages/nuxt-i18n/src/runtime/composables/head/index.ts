import { isVue2 } from '../../utils'
import { useNuxtApp } from '#app'
import { useI18nHeadBridge } from './bridge'
import { useI18nHeadNuxt3 } from './nuxt3'

import type { I18nHeadOptions } from '../../../types'

export function useI18nHead(options: I18nHeadOptions = {}) {
  const { vueApp } = useNuxtApp()

  // TODO: should switch to vue-demi
  if (isVue2(vueApp.version)) {
    return useI18nHeadBridge(options)
  } else {
    return useI18nHeadNuxt3(options)
  }
}
