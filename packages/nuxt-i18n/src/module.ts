import { createRequire } from 'module'
import createDebug from 'debug'
import {
  Nuxt,
  defineNuxtModule,
  isNuxt2,
  installModule,
  resolveModule,
  checkNuxtCompatibilityIssues
} from '@nuxt/kit'
import { setupVueI18nBridge } from './vue-i18n'
import { setupCompositionApi } from './composition'

import type { Options } from '@nuxtjs/i18n'
export type NuxtI18nNextOptions = Options

const debug = createDebug('nuxt/i18n:module')

const NuxtI18nModule = defineNuxtModule<NuxtI18nNextOptions>({
  name: '@kazupon/nuxt-i18n-next',
  configKey: 'i18n',
  defaults: {},
  async setup(options, nuxt) {
    const _require = createRequire(import.meta.url)

    console.log('setup isNuxt2?', isNuxt2(nuxt))
    if (isNuxt2(nuxt)) {
      // nuxt2 or nuxt bridge

      // install `@nuxtjs/i18n` module
      await installModule(nuxt, _require.resolve('@nuxtjs/i18n'))

      // check whether `@nuxt/bridge` is installed
      const installed = await isInstalledNuxtBridge(nuxt)
      console.log('installed nuxt bridge', installed)
      if (installed) {
        setupVueI18nBridge(nuxt)
        setupCompositionApi(nuxt)
      }
    } else {
      // nuxt3
      // setup for Nuxt 3
      // TODO:
    }
  }
})

async function isInstalledNuxtBridge(nuxt: Nuxt): Promise<boolean> {
  let ret = false
  try {
    const loadPath = resolveModule('@nuxt/bridge')
    ret = true
  } catch (e) {
    debug('cannot find @nuxt/bridge')
  }
  return Promise.resolve(ret)
  /*
  // TODO: 
  return new Promise((resolve, reject) => {
    nuxt.hook('modules:done', (moduleContainer: any) => {
      for (const [name, m] of Object.entries(
        moduleContainer.requiredModules || {}
      )) {
        const requires = (m as any)?.handler?.meta?.requires
        if (requires) {
          const issues = checkNuxtCompatibilityIssues(requires, nuxt)
          if (issues.length === 0) {
            // TODO:
            resolve(true)
          }
        }
      }
    })
  })
  */
}

export default NuxtI18nModule
