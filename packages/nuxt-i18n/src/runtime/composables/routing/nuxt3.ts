import type { Locale } from 'vue-i18n'
import type { Route, RawLocation } from 'vue-router'

export function useI18nRoutingNuxt3() {
  console.log('nuxt3 routing composition api')

  // TODO:
  function getRouteBaseName(givenRoute?: Route) {
    return ''
  }

  // TODO:
  function localePath(route: RawLocation, locale: Locale) {
    return ''
  }

  // TODO:
  function localeRoute(route: RawLocation, locale: Locale) {
    return ''
  }

  // TODO:
  function localeLocation(route: RawLocation, locale: Locale) {
    return ''
  }

  // TODO:
  function switchLocalePath(locale: Locale) {
    return ''
  }

  return {
    getRouteBaseName,
    localePath,
    localeRoute,
    localeLocation,
    switchLocalePath
  }
}
