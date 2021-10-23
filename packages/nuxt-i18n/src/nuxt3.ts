import type { Nuxt } from '@nuxt/kit'
import { setupCompositionApi } from './composition'

export function setupNuxt3(nuxt: Nuxt): void {
  setupCompositionApi(nuxt)

  // TODO: put other setup code here
}
