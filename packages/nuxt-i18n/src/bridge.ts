import { createRequire } from 'module'
import createDebug from 'debug'
import { isString, isObject } from '@intlify/shared'
import {
  resolveModule,
  addPluginTemplate,
  addTemplate,
  addVitePlugin,
  addWebpackPlugin
} from '@nuxt/kit'
import { resolve } from 'pathe'
import { distDir } from './dirs'
import {
  setupAliasTranspileOptions,
  getNormalizedLocales,
  resolveLocales
} from './utils'
import { loaderUnplugin } from './loader'
import { setupPages } from './pages'
import {
  MODULE_DEV_BRIDGE_ENTRIES,
  MODULE_PROD_BRIDGE_ENTRIES,
  NUXTI18N_LOADER_VIRTUAL_FILENAME,
  STRATEGIES
} from './constants'

import type { Nuxt } from '@nuxt/schema'
import type { NuxtI18nOptions } from './types'
import type { LoaderOptions } from './loader'

const debug = createDebug('@nuxtjs/i18n:bridge')

export async function setupNuxtBridge(
  options: NuxtI18nOptions,
  nuxt: Nuxt,
  mode: 'bridge' | 'bridge-on-legacy'
) {
  const _require = createRequire(import.meta.url)

  // Resolve Vue 2 builds
  nuxt.options.alias['vue'] = resolveModule('vue2/dist/vue.runtime.esm.js', {
    paths: nuxt.options.modulesDir
  })
  nuxt.options.build.transpile.push('vue')

  // Resolve Vue Router v3 builds
  nuxt.options.alias['vue-router'] = resolveModule(
    'vue-router3/dist/vue-router.esm.js',
    {
      paths: nuxt.options.modulesDir
    }
  )
  nuxt.options.build.transpile.push('vue-router')

  // Resolve vue-i18n-bridge
  for (const [name, entry] of Object.entries(
    nuxt.options.dev ? MODULE_DEV_BRIDGE_ENTRIES : MODULE_PROD_BRIDGE_ENTRIES
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
    setupPages(options, nuxt, { isBridge: true, localeCodes })
  }

  nuxt.options.router.middleware.push('nuxti18n')

  // prettier-ignore
  options.vueI18n = isObject(options.vueI18n)
    ? options.vueI18n
    : isString(options.vueI18n)
      ? resolve(nuxt.options.rootDir, options.vueI18n)
      : undefined

  // prettier-ignore
  const loaderOptions: LoaderOptions = { localeCodes, localeInfo, nuxtI18nOptions: options }
  addWebpackPlugin(loaderUnplugin.webpack(loaderOptions))
  addVitePlugin(loaderUnplugin.vite(loaderOptions))

  // options loading template
  addTemplate({
    filename: NUXTI18N_LOADER_VIRTUAL_FILENAME,
    getContents: () => {
      return `${nuxt.options.dev ? "// 'nuxti18n' option loading ..." : ''}`
    }
  })

  // add plugin
  if (mode === 'bridge') {
    addPluginTemplate({
      filename: 'runtime/bridge.plugin.mjs',
      src: resolve(distDir, 'runtime/bridge.plugin.mjs')
    })
  } else if (mode === 'bridge-on-legacy') {
    addPluginTemplate({
      filename: 'runtime/bridge-on-legacy.plugin.mjs',
      src: resolve(distDir, 'runtime/bridge-on-legacy.plugin.mjs')
    })
  }

  addPluginTemplate({
    filename: 'runtime/middleware.mjs',
    src: resolve(distDir, 'runtime/middleware.mjs')
  })

  // nuxt.hook('modules:done', () => {
  //   nuxt.options.plugins.unshift(plugin)
  // })
}
