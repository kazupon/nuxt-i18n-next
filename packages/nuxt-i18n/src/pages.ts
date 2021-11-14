import createDebug from 'debug'
import { extendPages } from '@nuxt/kit'

import type { Nuxt, NuxtPage } from '@nuxt/kit'
import type { NuxtI18nOptions } from './types'

const debug = createDebug('@nuxtjs/i18n:pages')

export function setupPages(
  options: NuxtI18nOptions,
  nuxt: Nuxt,
  isBridge = false
) {
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

  function fn(pages: NuxtPage[]) {
    const localizedPages = makePages(pages, {
      ...options,
      pagesDir,
      trailingSlash,
      includeUprefixedFallback
    })
    pages.splice(0, pages.length)
    pages.unshift(...localizedPages)
  }

  // TODO:
  //  We should be shimed with nuxt-bridge ...
  //  and, We should be shimed NuxtRouteConfig / NuxtPage (e.g. `component` / `file`)
  if (isBridge) {
    nuxt.options.router.extendRoutes = chainFn(
      nuxt.options.router.extendRoutes,
      fn
    )
  } else {
    extendPages(fn)
  }
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

// NOTE: bollow from `@nuxt/kit` at `src/utils/task.ts`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function chainFn(base: any, fn: any) {
  if (typeof fn !== 'function') {
    return base
  }
  return function (...args: unknown[]) {
    if (typeof base !== 'function') {
      // @ts-ignore
      return fn.apply(this, args)
    }
    // @ts-ignore
    let baseResult = base.apply(this, args)
    // Allow function to mutate the first argument instead of returning the result
    if (baseResult === undefined) {
      ;[baseResult] = args
    }
    const fnResult = fn.call(
      // @ts-ignore
      this,
      baseResult,
      ...Array.prototype.slice.call(args, 1)
    )
    // Return mutated argument if no result was returned
    if (fnResult === undefined) {
      return baseResult
    }
    return fnResult
  }
}
