import createDebug from 'debug'
import { createUnplugin } from 'unplugin'
import { parseURL } from 'ufo'
import { isObject, isString } from '@intlify/shared'
import { templateUtils } from '@nuxt/kit'
import { NUXTI18N_LOADER_VIRTUAL_FILENAME } from './constants' // TODO:
import { toCode } from './utils'

import type { NuxtI18nOptions, LocaleInfo } from './types'

export type LoaderOptions = {
  localeCodes?: string[]
  localeInfo?: LocaleInfo[]
  nuxtI18nOptions?: NuxtI18nOptions
}

const debug = createDebug('@nuxtjs/i18n:loader')

export const loaderUnplugin = createUnplugin((options: LoaderOptions = {}) => ({
  name: 'nuxt-i18n-loader',
  enforce: 'post',

  transformInclude(id) {
    const { pathname } = parseURL(id)
    return pathname.endsWith(NUXTI18N_LOADER_VIRTUAL_FILENAME)
  },

  async transform(code) {
    debug('original code -> ', code)

    // TODO: support lazy loading

    // prettier-ignore
    const genCode = `${Object.entries(options).map(([rootKey, rootValue]) => {
      if (rootKey === 'nuxtI18nOptions') {
        return `export const ${rootKey} = Object({${Object.entries(rootValue).map(([key, value]) => {
          if (key === 'vueI18n') {
            return `${key}: ${isObject(value)
              ? toCode(value)
              : isString(value)
                ? `(context) => import(${toCode(value)}).then(r => (r.default || r)(context))`
                : `${toCode({})}`
            }`
          } else {
            return `${key}: ${toCode(value)}`
          }
        }).join(`,`)}})`
      } else if (rootKey === 'localeInfo') {
        const localeInfo = options.localeInfo || []
        const importMapper = new Map<string, string>()
        localeInfo.forEach(({ code }) => {
          importMapper.set(code, templateUtils.importName(`locale_${code}`))
        })
        return `${localeInfo.map(l => `import ${importMapper.get(l.code)} from ${templateUtils.serialize(l.path)}`).join(`\n`)}
export const messages = () => Promise.resolve(Object({${[...importMapper].map(i => `${templateUtils.serialize(i[0])}:${i[1]}`).join(`,`)}}))`
      } else {
        return `export const ${rootKey} = ${toCode(rootValue)}`
      }
    }).join('\n')}`

    debug('generate code', genCode)
    return `${code}\n${genCode}`
  }
}))
