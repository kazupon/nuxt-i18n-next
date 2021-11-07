import { useI18n } from 'vue-i18n'
// import { useNuxtApp } from '#app'
import { isString } from '@intlify/shared'
import { DEFAULT_OPTIONS, STRATEGIES } from '../../constants'

import type { Locale } from 'vue-i18n'
import type { Route, RawLocation } from 'vue-router'
import type { I18nRoutingOptions } from './types'
import { Strategies } from '@nuxtjs/i18n'

export function useI18nRoutingNuxt3(options: I18nRoutingOptions = {}) {
  console.log('nuxt3 routing composition api')

  // use some features
  // const app = useNuxtApp()
  const $i18n = useI18n({ useScope: 'global' })
  // const $i18n = app.i18n.global
  const $router = useRouter()
  const $route = useRoute()
  console.log('$i18n', $i18n)
  console.log('$router', $router)
  console.log('$route', $route)

  // TODO: should check to see at here, wheather it has been initialized with `useXXX`
  //

  // if option values is undefined, initialize with default value at here
  const routesNameSeparator =
    options.routesNameSeparator || DEFAULT_OPTIONS.routesNameSeparator
  const strategy = options.strategy || (DEFAULT_OPTIONS.strategy as Strategies)

  /**
   * define routing utilities with Composition API
   */

  function getRouteBaseName(givenRoute?: Route) {
    const route = givenRoute != null ? givenRoute : ($route as unknown as Route)
    if (!route || !route.name) {
      return
    }
    return route.name.split(routesNameSeparator)[0]
  }

  function getLocaleRouteName(routeName: string, locale: Locale) {
    let name =
      routeName +
      (options.strategy === STRATEGIES.NO_PREFIX
        ? ''
        : routesNameSeparator + locale)

    if (
      locale === options.defaultLocale &&
      options.strategy === STRATEGIES.PREFIX_AND_DEFAULT
    ) {
      name += routesNameSeparator + options.defaultLocaleRouteNameSuffix
    }

    return name
  }

  function resolveRoute(route?: RawLocation, locale?: Locale) {
    let _route = route

    // Abort if no route or no locale
    if (!_route) {
      return
    }

    const _locale = locale || ($i18n.locale.value as Locale)

    // If route parameter is a string, check if it's a path or name of route.
    if (isString(_route)) {
      if (_route[0] === '/') {
        // If route parameter is a path, create route object with path.
        _route = { path: _route }
      } else {
        // Else use it as route name.
        _route = { name: _route }
      }
    }

    let localizedRoute = Object.assign({}, _route)

    if (localizedRoute.path && !localizedRoute.name) {
      const resolvedRoute = $router.resolve(localizedRoute)
      const resolvedRouteName = getRouteBaseName(
        resolvedRoute as unknown as Route
      )
      if (resolvedRouteName) {
        localizedRoute = {
          name: getLocaleRouteName(resolvedRouteName, _locale),
          params: resolvedRoute.params as any, // TODO:
          query: resolvedRoute.query,
          hash: resolvedRoute.hash
        }
      } else {
        // TODO:
        /*
        const isDefaultLocale = locale === options.defaultLocale
        // if route has a path defined but no name, resolve full route using the path
        const isPrefixed =
          // don't prefix default locale
          !(
            isDefaultLocale &&
            [
              STRATEGIES.PREFIX_EXCEPT_DEFAULT,
              STRATEGIES.PREFIX_AND_DEFAULT
            ].includes(strategy)
          ) &&
          // no prefix for any language
          !(options.strategy === STRATEGIES.NO_PREFIX) &&
          // no prefix for different domains
          !$i18n.differentDomains
        if (isPrefixed) {
          localizedRoute.path = `/${locale}${localizedRoute.path}`
        }
        localizedRoute.path = options.trailingSlash
          ? withTrailingSlash(localizedRoute.path, true)
          : withoutTrailingSlash(localizedRoute.path, true)
        */
      }
    } else {
      if (!localizedRoute.name && !localizedRoute.path) {
        localizedRoute.name = getRouteBaseName()
      }

      localizedRoute.name = getLocaleRouteName(localizedRoute.name!, _locale)

      const { params } = localizedRoute
      if (params && params['0'] === undefined && params.pathMatch) {
        params['0'] = params.pathMatch
      }
    }

    const resolvedRoute = $router.resolve(localizedRoute)
    if (resolvedRoute.name) {
      // TODO: for Vue2, resolvedRoute.route.name
      return resolvedRoute
    }

    // If didn't resolve to an existing route then just return resolved route based on original input.
    return $router.resolve(_route)
  }

  function localePath(route: RawLocation, locale: Locale) {
    const localizedRoute = resolveRoute(route, locale)
    return localizedRoute
      ? localizedRoute.redirectedFrom || localizedRoute.path
      : ''
  }

  function localeRoute(route: RawLocation, locale: Locale) {
    const resolved = resolveRoute(route, locale)
    // TODO:
    return resolved
  }

  function localeLocation(route: RawLocation, locale: Locale) {
    const resolved = resolveRoute(route, locale)
    // TODO:
    return resolved
  }

  function switchLocalePath(locale: Locale) {
    const name = getRouteBaseName()
    if (!name) {
      return ''
    }

    const { params, ...routeCopy } = $route
    const langSwitchParams = {}

    // TODO: for vuex
    // if (options.vuex && options.vuex.syncRouteParams && store) {
    //   langSwitchParams =
    //     store.getters[`${options.vuex.moduleName}/localeRouteParams`](locale)
    // }

    const baseRoute = Object.assign({}, routeCopy, {
      name,
      params: {
        ...params,
        ...langSwitchParams,
        0: params.pathMatch
      }
    }) as RawLocation
    const path = localePath(baseRoute, locale)

    // TODO: for domainDifference

    return path
  }

  return {
    getRouteBaseName,
    localePath,
    localeRoute,
    localeLocation,
    switchLocalePath
  }
}
