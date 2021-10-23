import { setupVueI18nBridge } from './vue-i18n'
import { setupCompositionApi } from './composition'

import type { Nuxt } from '@nuxt/kit'

export function setupNuxtBridge(nuxt: Nuxt): void {
  setupVueI18nBridge(nuxt)
  setupCompositionApi(nuxt)
}
