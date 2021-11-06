import { createRequire } from 'module'
import { addPluginTemplate, useNuxt, resolveModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'
import { setupAliasTranspileOptions } from './utils'
import {
  MODULE_DEV_BRIDGE_ENTRIES,
  MODULE_PROD_BRIDGE_ENTRIES
} from './constants'

import type { NuxtI18nNextOptions } from './types'

export function setupNuxtBridge(options: NuxtI18nNextOptions): void {
  const nuxt = useNuxt()
  const _require = createRequire(import.meta.url)

  // Resolve vue2 builds
  nuxt.options.alias.vue2 = resolveModule('vue/dist/vue.runtime.esm.js', {
    paths: nuxt.options.modulesDir
  })
  nuxt.options.build.transpile.push('vue')

  // Resolve vue-i18n-bridge
  for (const [name, entry] of Object.entries(
    nuxt.options.dev ? MODULE_DEV_BRIDGE_ENTRIES : MODULE_PROD_BRIDGE_ENTRIES
  )) {
    setupAliasTranspileOptions(nuxt, name, _require.resolve(entry))
  }

  // add plugin
  addPluginTemplate({
    filename: 'runtime/bridge.plugin.mjs',
    src: resolve(distDir, 'runtime/bridge.plugin.mjs')
  })

  // nuxt.hook('modules:done', () => {
  //   nuxt.options.plugins.unshift(plugin)
  // })
}
