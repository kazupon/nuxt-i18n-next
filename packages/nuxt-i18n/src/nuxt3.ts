import { addPluginTemplate, useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'

import type { NuxtI18nNextOptions } from './types'

export function setupNuxt3(options: NuxtI18nNextOptions): void {
  const nuxt = useNuxt()

  // add plugin
  addPluginTemplate({
    filename: 'runtime/nuxt3.plugin.mjs',
    src: resolve(distDir, 'runtime/nuxt3.plugin.mjs')
  })
}
