import { addPluginTemplate, useNuxt, resolveModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'

import type { NuxtI18nNextOptions } from './types'

export function setupNuxtBridge(options: NuxtI18nNextOptions): void {
  const nuxt = useNuxt()

  // Resolve vue2 builds
  nuxt.options.alias.vue2 = resolveModule('vue/dist/vue.runtime.esm.js', {
    paths: nuxt.options.modulesDir
  })
  nuxt.options.build.transpile.push('vue')

  // add plugin
  addPluginTemplate({
    filename: 'runtime/bridge.plugin.mjs',
    src: resolve(distDir, 'runtime/bridge.plugin.mjs')
  })

  // nuxt.hook('modules:done', () => {
  //   nuxt.options.plugins.unshift(plugin)
  // })
}
