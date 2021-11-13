import { addPluginTemplate, useNuxt, resolveModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'

import type { NuxtI18nOptions } from './types'

export function setupComposables(
  options: NuxtI18nOptions,
  mode: 'bridge' | 'bridge-on-legacy' | 'nuxt3'
): void {
  const nuxt = useNuxt()

  // vue-demi
  // nuxt.options.alias['vue-demi'] = resolveModule('vue-demi/lib/index.mjs', {
  //   paths: nuxt.options.modulesDir
  // })
  // nuxt.options.build.transpile.push('vue-demi')
  nuxt.options.alias['#i18n'] = resolve(
    distDir,
    `runtime/composables/${
      mode === 'bridge' || mode === 'bridge-on-legacy' ? 'i18n' : 'nuxt3'
    }.mjs`
  )

  if (mode === 'bridge' || mode === 'bridge-on-legacy') {
    nuxt.options.alias['vue-router'] = 'vue-router3/dist/vue-router.esm.js'
    // nuxt.options.build.transpile.push('vue-router')
  } else {
    nuxt.options.alias['vue-router'] =
      'vue-router/dist/vue-router.esm-bundler.js'
    // nuxt.options.build.transpile.push('vue-router')
  }

  // add plugin
  // addPluginTemplate({
  //   filename: 'runtime/composables/plugin.mjs',
  //   src: resolve(distDir, 'runtime/composables/plugin.mjs')
  // })
}
