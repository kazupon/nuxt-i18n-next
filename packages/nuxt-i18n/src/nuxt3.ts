import { createRequire } from 'module'
import createDebug from 'debug'
import {
  addPluginTemplate,
  addTemplate,
  addVitePlugin,
  addWebpackPlugin
} from '@nuxt/kit'
import { resolve } from 'pathe'
import { isString, isObject } from '@intlify/shared'
import { distDir } from './dirs'
import {
  setupAliasTranspileOptions,
  getNormalizedLocales,
  resolveLocales
} from './utils'
import { loaderUnplugin } from './loader'
import { setupPages } from './pages'
import {
  MODULE_DEV_NUXT3_ENTRIES,
  MODULE_PROD_NUXT3_ENTRIES,
  NUXTI18N_LOADER_VIRTUAL_FILENAME,
  STRATEGIES
} from './constants'

import type { NuxtI18nOptions } from './types'
import type { Nuxt } from '@nuxt/schema'
import type { LoaderOptions } from './loader'

const debug = createDebug('@nuxtjs/i18n:nuxt3')

export async function setupNuxt3(options: NuxtI18nOptions, nuxt: Nuxt) {
  const _require = createRequire(import.meta.url)

  // Resolve vue-i18n-next
  for (const [name, entry] of Object.entries(
    nuxt.options.dev ? MODULE_DEV_NUXT3_ENTRIES : MODULE_PROD_NUXT3_ENTRIES
  )) {
    setupAliasTranspileOptions(nuxt, name, _require.resolve(entry))
  }

  options.langDir = options.langDir || 'locales'
  const langPath = resolve(nuxt.options.srcDir, options.langDir)
  debug('langDir path', langPath)

  const normalizedLocales = (options.locales = getNormalizedLocales(
    options.locales
  ))
  const localeCodes = normalizedLocales.map(locale => locale.code)
  const localeInfo = await resolveLocales(langPath, normalizedLocales)
  debug('localeInfo', localeInfo)

  if (options.strategy !== STRATEGIES.NO_PREFIX && localeCodes.length) {
    setupPages(options, nuxt, { localeCodes })
  }

  // prettier-ignore
  options.vueI18n = isObject(options.vueI18n)
    ? options.vueI18n
    : isString(options.vueI18n)
      ? resolve(nuxt.options.rootDir, options.vueI18n)
      : undefined

  const loaderOptions: LoaderOptions = {
    localeCodes,
    localeInfo,
    nuxtI18nOptions: options
  }
  addWebpackPlugin(loaderUnplugin.webpack(loaderOptions))
  addVitePlugin(loaderUnplugin.vite(loaderOptions))

  // options loading template
  addTemplate({
    filename: NUXTI18N_LOADER_VIRTUAL_FILENAME,
    getContents: () => {
      return `${nuxt.options.dev ? "// 'vueI18n' option loading ..." : ''}`
    }
  })

  // add plugin
  addPluginTemplate({
    filename: 'runtime/nuxt3.plugin.mjs',
    src: resolve(distDir, 'runtime/nuxt3.plugin.mjs')
  })
}
