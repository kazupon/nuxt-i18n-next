import { useNuxtApp } from '#app'
import { getCurrentInstance, computed } from '@vue/composition-api'
import VueRouter from 'vue-router3'
import { assign, isString, isSymbol } from '@intlify/shared'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// TODO:
// @ts-ignore: resolved with tsconfig
import { nuxtI18nOptions } from '#build/nuxti18n.loader'
import { STRATEGIES } from '../../constants'

import type { Route, RawLocation } from 'vue-router3'
import type { Locale } from '@nuxtjs/i18n'
import type { I18nRoutingOptions } from './types'
import type { I18n } from 'vue-i18n-bridge'

export function useI18nRoutingBridge(options: I18nRoutingOptions = {}) {
  const {
    nuxt2Context: { $i18n }
  } = useNuxtApp()

  if (!$i18n) {
    throw new Error('@nuxtjs/i18n not initialized in nuxt bridge')
  }
  const _i18n = $i18n as I18n<unknown, unknown, unknown, string, false>

  // @ts-ignore
  const $router = useRouter() as VueRouter
  // @ts-ignore
  const $route = useRoute() as Route
  console.log('$router', $router)
  console.log('$route', $route)

  // if option values is undefined, initialize with default value at here
  const routesNameSeparator =
    options.routesNameSeparator || nuxtI18nOptions.routesNameSeparator
  const strategy = options.strategy || nuxtI18nOptions.strategy
  const defaultLocaleRouteNameSuffix =
    options.defaultLocaleRouteNameSuffix ||
    nuxtI18nOptions.defaultLocaleRouteNameSuffix
  const defaultLocale = options.defaultLocale || nuxtI18nOptions.defaultLocale

  /**
   * define routing utilities with Composition API
   */

  function getRouteBaseName(givenRoute?: Route) {
    const route = givenRoute != null ? givenRoute : $route
    if (!route || !route.name) {
      return
    }
    const name = getRouteName(route.name)
    return name.split(routesNameSeparator)[0]
  }

  function getLocaleRouteName(routeName: string | null, locale: Locale) {
    let name =
      getRouteName(routeName) +
      (strategy === STRATEGIES.NO_PREFIX ? '' : routesNameSeparator + locale)

    if (
      locale === defaultLocale &&
      strategy === STRATEGIES.PREFIX_AND_DEFAULT
    ) {
      name += routesNameSeparator + defaultLocaleRouteNameSuffix
    }

    return name
  }

  function resolveRoute(
    route: RawLocation,
    locale?: Locale
  ): ReturnType<VueRouter['resolve']> | undefined {
    // Abort if no route or no locale
    if (!route) {
      return
    }

    const _locale = locale || _i18n.global.locale.value

    // If route parameter is a string, check if it's a path or name of route.
    if (isString(route)) {
      if (route[0] === '/') {
        // If route parameter is a path, create route object with path.
        route = { path: route }
      } else {
        // Else use it as route name.
        route = { name: route }
      }
    }

    let localizedRoute = assign({}, route)

    if (localizedRoute.path && !localizedRoute.name) {
      const resolvedRoute = $router.resolve(localizedRoute).route
      const resolvedRouteName = getRouteBaseName(resolvedRoute)
      if (resolvedRouteName) {
        localizedRoute = {
          name: getLocaleRouteName(resolvedRouteName, _locale),
          params: resolvedRoute.params,
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
    if (resolvedRoute.route.name) {
      return resolvedRoute
    }

    // If didn't resolve to an existing route then just return resolved route based on original input.
    return $router.resolve(route)
  }

  function localePath(route: RawLocation, locale: Locale) {
    const localizedRoute = resolveRoute(route, locale)
    return localizedRoute
      ? localizedRoute.route.redirectedFrom || localizedRoute.route.fullPath
      : ''
  }

  function localeRoute(route: RawLocation, locale: Locale) {
    const resolved = resolveRoute(route, locale)
    return resolved ? resolved.route : undefined
  }

  function localeLocation(route: RawLocation, locale: Locale) {
    const resolved = resolveRoute(route, locale)
    return resolved ? resolved.location : undefined
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

    const baseRoute = assign({}, routeCopy, {
      name,
      params: {
        ...params,
        ...langSwitchParams,
        0: params.pathMatch
      }
    })
    const path = localePath(baseRoute, locale)

    // TODO: for domainDifference

    console.log('swtichLocalePath', locale, path)
    return path
  }

  return {
    i18n: _i18n,
    getRouteBaseName,
    localePath,
    localeRoute,
    localeLocation,
    switchLocalePath
  }
}

function getRouteName(routeName?: string | symbol | null) {
  // prettier-ignore
  return isString(routeName)
    ? routeName
    : isSymbol(routeName)
      ? routeName.toString()
      : ''
}
