import { addPluginTemplate, useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'

import type { NuxtI18nNextOptions } from './types'

export function setupNuxtBridge(options: NuxtI18nNextOptions): void {
  const nuxt = useNuxt()
  console.log('setup Composition Api')

  // add plugin
  const plugin = addPluginTemplate({
    filename: 'plugin.mjs',
    src: resolve(distDir, './plugin.mjs')
  })
  // nuxt.hook('modules:done', () => {
  //   nuxt.options.plugins.unshift(plugin)
  // })
}
