import createDebug from 'debug'
import { extendPages } from '@nuxt/kit'

import type { Nuxt, NuxtPage } from '@nuxt/kit'
import type { NuxtI18nOptions } from './types'

const debug = createDebug('@nuxtjs/i18n:pages')

export function setupPages(options: NuxtI18nOptions, nuxt: Nuxt) {
  let includeUprefixedFallback = nuxt.options.target === 'static'
  nuxt.hook('generate:before', () => {
    debug('called generate:before hook')
    includeUprefixedFallback = true
  })

  const pagesDir =
    nuxt.options.dir && nuxt.options.dir.pages
      ? nuxt.options.dir.pages
      : 'pages'
  const { trailingSlash } = nuxt.options.router
  debug(`pageDir: ${pagesDir}, tailingSlash: ${trailingSlash}`)

  extendPages(pages => {
    const localizedPages = makePages(pages, {
      ...options,
      pagesDir,
      trailingSlash,
      includeUprefixedFallback
    })
    pages.splice(0, pages.length)
    pages.unshift(...localizedPages)
  })
}

function makePages(
  basePages: NuxtPage[],
  options: {
    pagesDir: string
    includeUprefixedFallback: boolean
    trailingSlash: unknown // TODO: fix type
  } & NuxtI18nOptions
): NuxtPage[] {
  debug('makePages', basePages, options)

  const localizedPages: NuxtPage[] = []

  // TODO:
  return localizedPages
}
