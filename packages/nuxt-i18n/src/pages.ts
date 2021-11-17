import createDebug from 'debug'
import { extendPages } from '@nuxt/kit'
import { isString } from '@intlify/shared'
import { STRATEGIES } from './constants'

import type { Nuxt, NuxtPage } from '@nuxt/kit'
import type { NuxtRouteConfig } from '@nuxt/types/config/router'
import type { NuxtI18nOptions } from './types'

const debug = createDebug('@nuxtjs/i18n:pages')

// TODO: fix type
type NuxtI18nPage = NuxtPage & NuxtRouteConfig & { redirect?: boolean }

export function setupPages(
  options: NuxtI18nOptions,
  nuxt: Nuxt,
  additionalOptions: { isBridge?: boolean; localeCodes: string[] } = {
    isBridge: false,
    localeCodes: []
  }
) {
  const { isBridge } = additionalOptions
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
  debug(`pagesDir: ${pagesDir}, tailingSlash: ${trailingSlash}`)

  extendPages((pages: NuxtI18nPage[]) => {
    const localizedPages = makePages(pages, {
      ...options,
      ...additionalOptions,
      pagesDir,
      trailingSlash,
      includeUprefixedFallback
    })
    pages.splice(0, pages.length)
    pages.unshift(...localizedPages)
    debug('made pages ...', pages)
  })
}

function makePages(
  basePages: NuxtI18nPage[],
  options: {
    isBridge?: boolean
    localeCodes: string[]
    pagesDir: string
    includeUprefixedFallback: boolean
    trailingSlash: boolean
  } & NuxtI18nOptions
): NuxtI18nPage[] {
  debug('makePages', basePages, options)
  const {
    isBridge,
    localeCodes,
    pages: pagesOptions,
    pagesDir,
    defaultLocale,
    routesNameSeparator,
    strategy,
    defaultLocaleRouteNameSuffix,
    differentDomains,
    trailingSlash,
    includeUprefixedFallback,
    parsePages
  } = options

  function makeLocalizedPages(
    page: NuxtI18nPage,
    allowedLocaleCodes: string[],
    isChild = false,
    isExtraPageTree = false
  ): NuxtI18nPage[] {
    return isBridge
      ? makeLocalizedPagesForBridge(
          page,
          allowedLocaleCodes,
          isChild,
          isExtraPageTree
        )
      : makeLocalizedPagesForNuxt3(
          page,
          allowedLocaleCodes,
          isChild,
          isExtraPageTree
        )
  }

  function makeLocalizedPagesForBridge(
    page: NuxtI18nPage,
    allowedLocaleCodes: string[],
    isChild = false,
    isExtraPageTree = false
  ): NuxtI18nPage[] {
    // Skip page if it is only a redirect without a component.
    if (page.redirect && !page.component) {
      return [page]
    }

    // TODO: we should extract from component options too
    const pageOptions = getPageOptions(
      page,
      pagesOptions!, // TODO: fix type
      allowedLocaleCodes,
      pagesDir,
      defaultLocale
    )

    // Skip route if i18n is disabled on page
    if (pageOptions === false) {
      return [page]
    }

    // Component-specific options
    const componentOptions = {
      // @ts-ignore
      locales: localeCodes,
      ...pageOptions,
      ...{ locales: allowedLocaleCodes }
    }

    // Double check locales to remove any locales not found in pageOptions.
    // This is there to prevent children pages being localized even though they are disabled in the configuration.
    if (componentOptions.locales.length > 0 && pageOptions.locales.length > 0) {
      const filteredLocales = []
      for (const locale of componentOptions.locales) {
        if (pageOptions.locales.includes(locale)) {
          filteredLocales.push(locale)
        }
      }
      componentOptions.locales = filteredLocales
    }

    const pages = componentOptions.locales.reduce((pages, locale) => {
      const { name } = page
      let { path } = page
      const localizedPage = { ...page }

      // Make localized page name. Name might not exist on parent page if child has same path.
      if (name) {
        // TODO: should be fixed routesNameSeparator when it's `undefind` ...
        localizedPage.name = name + routesNameSeparator + locale
      }

      // Generate localized children pages if any
      if (page.children) {
        localizedPage.children = page.children.reduce(
          (children, child) => [
            ...children,
            ...makeLocalizedPagesForBridge(
              child,
              [locale],
              true,
              isExtraPageTree
            )
          ],
          [] as NonNullable<NuxtI18nPage['children']>
        )
      }

      // Get custom path if any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (componentOptions.paths && (componentOptions.paths as any)[locale]) {
        path = componentOptions.paths[locale]
      }

      const isDefaultLocale = locale === defaultLocale

      // For PREFIX_AND_DEFAULT strategy and default locale:
      // - if it's a parent page, add it with default locale suffix added (no suffix if page has children)
      // - if it's a child page of that extra parent page, append default suffix to it
      if (isDefaultLocale && strategy === STRATEGIES.PREFIX_AND_DEFAULT) {
        if (!isChild) {
          const defaultPage = { ...localizedPage, path }

          // TODO: fix type
          if (name) {
            defaultPage.name =
              localizedPage.name! +
              routesNameSeparator! +
              defaultLocaleRouteNameSuffix!
          }

          if (page.children) {
            // Recreate child routes with default suffix added
            defaultPage.children = []
            for (const childRoute of page.children) {
              // isExtraRouteTree argument is true to indicate that this is extra route added for PREFIX_AND_DEFAULT strategy
              defaultPage.children = defaultPage.children.concat(
                makeLocalizedPagesForBridge(childRoute, [locale], true, true)
              )
            }
          }

          pages.push(defaultPage)
        } else if (isChild && isExtraPageTree && name) {
          // TODO: fix type
          localizedPage.name +=
            routesNameSeparator! + defaultLocaleRouteNameSuffix!
        }
      }

      const isChildWithRelativePath = isChild && !path.startsWith('/')

      // Add route prefix if needed
      const shouldAddPrefix =
        // No prefix if app uses different locale domains
        !differentDomains &&
        // No need to add prefix if child's path is relative
        !isChildWithRelativePath &&
        // Skip default locale if strategy is PREFIX_EXCEPT_DEFAULT
        !(isDefaultLocale && strategy === STRATEGIES.PREFIX_EXCEPT_DEFAULT)

      if (shouldAddPrefix) {
        path = `/${locale}${path}`
      }

      // - Follow Nuxt and add or remove trailing slashes depending on "router.trailingSlash`
      // - If "router.trailingSlash" is not specified then default to no trailing slash (like Nuxt)
      // - Children with relative paths must not start with slash so don't append if path is empty.
      if (path.length) {
        // Don't replace empty (child) path with a slash!
        path = adjustRouteDefinitionForTrailingSlash(
          path,
          trailingSlash,
          isChildWithRelativePath
        )
      }

      if (
        shouldAddPrefix &&
        isDefaultLocale &&
        strategy === STRATEGIES.PREFIX &&
        includeUprefixedFallback
      ) {
        pages.push({ ...page })
      }

      localizedPage.path = path
      pages.push(localizedPage)

      return pages
    }, [] as NuxtI18nPage[])

    return pages
  }

  function makeLocalizedPagesForNuxt3(
    page: NuxtI18nPage,
    allowedLocaleCodes: string[],
    isChild = false,
    isExtraPageTree = false
  ): NuxtI18nPage[] {
    const pages: NuxtI18nPage[] = []
    // TODO:
    //
    return pages
  }

  const localizedPages = basePages.reduce(
    (localized, page) => [
      ...localized,
      ...makeLocalizedPages(page, localeCodes)
    ],
    [] as NuxtI18nPage[]
  )

  // TODO:
  //  should be sorted logic here

  debug('localizedPages', localizedPages)
  return localizedPages
}

type GetPageOptionsReturn = {
  locales: string[]
  paths: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

function getPageOptions(
  page: NuxtI18nPage,
  pages: NonNullable<NuxtI18nOptions['pages']>,
  localeCodes: string[],
  pagesDir: string,
  defaultLocale: NuxtI18nOptions['defaultLocale']
): false | GetPageOptionsReturn {
  const options = {
    locales: localeCodes,
    paths: {}
  }

  const pattern = new RegExp(`${pagesDir}/`, 'i')
  const chunkName = page.chunkName
    ? page.chunkName.replace(pattern, '')
    : page.name
  const pageOptions = chunkName ? pages[chunkName] : undefined

  // Routing disabled
  if (pageOptions === false) {
    return false
  }

  // Skip if no page options defined
  if (!pageOptions) {
    return options
  }

  // Remove disabled locales from page options
  options.locales = options.locales.filter(
    locale => pageOptions[locale] !== false
  )

  // Construct paths object
  for (const locale of options.locales) {
    const customLocalePath = pageOptions[locale]
    if (isString(customLocalePath)) {
      // Set custom path if any
      ;(options.paths as any)[locale] = customLocalePath // eslint-disable-line @typescript-eslint/no-explicit-any
      continue
    }

    // TODO: fix type
    const customDefaultLocalePath = pageOptions[defaultLocale!] // eslint-disable-line @typescript-eslint/no-explicit-any
    if (isString(customDefaultLocalePath)) {
      // Set default locale's custom path if any
      ;(options.paths as any)[locale] = customDefaultLocalePath // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }

  return options
}

function adjustRouteDefinitionForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean
) {
  return (
    pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') ||
    (isChildWithRelativePath ? '' : '/')
  )
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
