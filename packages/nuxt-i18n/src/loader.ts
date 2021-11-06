import createDebug from 'debug'
import { createUnplugin } from 'unplugin'
import { parseURL } from 'ufo'
import { promises as fs } from 'fs'
import { isObject, isString } from '@intlify/shared'
import { NUXTI18N_OPTIONS_VIRTUAL_FILENAME } from './constants'

import type { NuxtI18nNextOptions } from './types'

export type LoaderOptions = Pick<NuxtI18nNextOptions, 'vueI18n'>

const debug = createDebug('@nuxtjs/i18n:loader')

export const optionLoader = createUnplugin((options: LoaderOptions = {}) => ({
  name: 'nuxtjs-i18n-options-loader',
  enforce: 'post',

  transformInclude(id) {
    const { pathname } = parseURL(id)
    return pathname.endsWith(NUXTI18N_OPTIONS_VIRTUAL_FILENAME)
  },

  async transform(code) {
    debug('original code -> ', code)
    options.vueI18n

    let loadingCode = `export default () => Promise.resolve({})`
    if (isObject(options.vueI18n)) {
      loadingCode = `export default () => Promise.resolve(${JSON.stringify(
        options.vueI18n || {}
      )})`
    } else if (isString(options.vueI18n)) {
      loadingCode = await fs.readFile(options.vueI18n, 'utf8')
    }

    debug('injecting code -> ', loadingCode)
    return `${code}\n${loadingCode}`
  }
}))
