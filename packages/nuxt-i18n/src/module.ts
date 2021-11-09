import createDebug from 'debug'
import {
  Nuxt,
  defineNuxtModule,
  isNuxt2,
  isNuxt3,
  resolveModule,
  checkNuxtCompatibilityIssues
} from '@nuxt/kit'
import { setupNuxtBridge } from './bridge'
import { setupNuxt3 } from './nuxt3'
import { setupComposables } from './composable'

import type { NuxtI18nNextOptions } from './types'

export * from './types'

const debug = createDebug('nuxt/i18n:module')

const NuxtI18nModule = defineNuxtModule<NuxtI18nNextOptions>({
  name: '@kazupon/nuxt-i18n-next',
  configKey: 'i18n',
  defaults: {},
  async setup(options, nuxt) {
    debug('setup isNuxt2?', isNuxt2(nuxt))
    if (isNuxt2(nuxt)) {
      // nuxt2 or nuxt bridge

      await setupNuxtBridge(options)
      setupComposables(options, 'bridge')
    } else if (isNuxt3(nuxt)) {
      // nuxt3
      await setupNuxt3(options)
      setupComposables(options, 'nuxt3')
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
