import { addPluginTemplate, useNuxt, resolveModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'

import type { NuxtI18nNextOptions } from './types'

export function setupComposables(options: NuxtI18nNextOptions): void {
  const nuxt = useNuxt()

  // vue-demi
  // nuxt.options.alias['vue-demi'] = resolveModule('vue-demi/lib/index.mjs', {
  //   paths: nuxt.options.modulesDir
  // })
  // nuxt.options.build.transpile.push('vue-demi')
  nuxt.options.alias['#i18n'] = resolve(distDir, 'runtime/composables/i18n.mjs')

  // add plugin
  addPluginTemplate({
    filename: 'runtime/composables/plugin.mjs',
    src: resolve(distDir, 'runtime/composables/plugin.mjs')
  })
}
