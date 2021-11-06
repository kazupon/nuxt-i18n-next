import { createRequire } from 'module'
import createDebug from 'debug'
import {
  addPluginTemplate,
  addTemplate,
  useNuxt,
  addVitePlugin,
  addWebpackPlugin
} from '@nuxt/kit'
import { resolve } from 'pathe'
import { isString, isObject } from '@intlify/shared'
import { distDir } from './dirs'
import { setupAliasTranspileOptions, resolveLocales } from './utils'
import { optionLoader } from './loader'
import {
  MODULE_DEV_NUXT3_ENTRIES,
  MODULE_PROD_NUXT3_ENTRIES,
  NUXTI18N_LOCALE_VIRTUAL_FILENAME,
  NUXTI18N_OPTIONS_VIRTUAL_FILENAME
} from './constants'

import type { NuxtI18nNextOptions } from './types'
import type { LoaderOptions } from './loader'

const debug = createDebug('@nuxtjs/i18n:setupNuxt3')

export async function setupNuxt3(options: NuxtI18nNextOptions) {
  const nuxt = useNuxt()
  const _require = createRequire(import.meta.url)

  // Resolve vue-i18n-bridge
  for (const [name, entry] of Object.entries(
    nuxt.options.dev ? MODULE_DEV_NUXT3_ENTRIES : MODULE_PROD_NUXT3_ENTRIES
  )) {
    setupAliasTranspileOptions(nuxt, name, _require.resolve(entry))
  }

  // vue-i18n options loading template
  addTemplate({
    filename: NUXTI18N_OPTIONS_VIRTUAL_FILENAME,
    getContents: () => {
      return `${nuxt.options.dev ? "// 'vueI18n' option loading ..." : ''}`
    }
  })

  // prettier-ignore
  const loaderOptions: LoaderOptions = {
    vueI18n: isObject(options.vueI18n)
      ? options.vueI18n
      : isString(options.vueI18n)
        ? resolve(nuxt.options.rootDir, options.vueI18n)
        : undefined
  }
  addWebpackPlugin(optionLoader.webpack(loaderOptions))
  addVitePlugin(optionLoader.vite(loaderOptions))

  const langDir = options.langDir || 'locales'
  const langPath = resolve(nuxt.options.srcDir, langDir)
  debug('langDir path', langPath)

  const localeResources = options.locales
    ? await resolveLocales(langPath, options.locales)
    : []

  // locale messages load template
  addTemplate({
    filename: NUXTI18N_LOCALE_VIRTUAL_FILENAME,
    getContents: ({ utils }) => {
      const importMapper = new Map<string, string>()
      localeResources.forEach(({ code }) => {
        importMapper.set(code, utils.importName(`locale_${code}`))
      })
      // prettier-ignore
      return `
${localeResources.map(l => `import ${importMapper.get(l.code)} from '${l.path}'`).join('\n')}
export default { ${[...importMapper].map(i => `${JSON.stringify(i[0])}:${i[1]}`).join(',')} }
`
    }
  })

  // add plugin
  addPluginTemplate({
    filename: 'runtime/nuxt3.plugin.mjs',
    src: resolve(distDir, 'runtime/nuxt3.plugin.mjs')
  })
}
