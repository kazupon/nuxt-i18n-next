import { createRequire } from 'module'
import createDebug from 'debug'
import {
  defineNuxtModule,
  isNuxt2,
  isNuxt3,
  resolveModule,
  installModule,
  checkNuxtCompatibilityIssues
} from '@nuxt/kit'
import { assign } from '@intlify/shared'
import { setupNuxtBridge } from './bridge'
import { setupNuxt3 } from './nuxt3'
import { setupApi } from './api'
import { DEFAULT_OPTIONS } from './constants'

import type { Nuxt } from '@nuxt/schema'
import type { NuxtI18nOptions } from './types'

export * from './types'

const debug = createDebug('@nuxtjs/i18n:module')

const NuxtI18nModule = defineNuxtModule<NuxtI18nOptions>({
  name: '@kazupon/nuxt-i18n-next',
  configKey: 'i18n',
  defaults: {},
  async setup(options, nuxt) {
    // const _require = createRequire(import.meta.url)

    // TODO: nuxt-i18n options should be merged with defaults
    options = assign(DEFAULT_OPTIONS, options)
    debug('options', options)

    debug('setup isNuxt2?', isNuxt2(nuxt))
    if (isNuxt2(nuxt)) {
      // nuxt2 or nuxt bridge

      // install `@nuxtjs/i18n` module
      // await installModule(nuxt, _require.resolve('@nuxtjs/i18n'))

      // check whether `@nuxt/bridge` is installed
      // const installed = await isInstalledNuxtBridge(nuxt)
      // debug('installed nuxt bridge', installed)

      await setupNuxtBridge(options, nuxt, 'bridge')
      // await setupNuxtBridge(options, 'bridge-on-legacy')
      setupApi(options, nuxt, 'bridge')
    } else if (isNuxt3(nuxt)) {
      // nuxt3
      await setupNuxt3(options, nuxt)
      setupApi(options, nuxt, 'nuxt3')
    } else {
      // TODO:
    }
  }
})

async function isInstalledNuxtBridge(nuxt: Nuxt): Promise<boolean> {
  let ret = false
  try {
    const loadPath = resolveModule('@nuxt/bridge')
    debug('@nuxt/bridge path', loadPath)
    ret = true
  } catch (e) {
    debug('cannot find @nuxt/bridge')
  }
  return ret
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
