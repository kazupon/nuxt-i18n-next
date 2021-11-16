import type { Route } from 'vue-router3'
// TODO: import type { RouteLocation } from 'vue-router'

export function isVue2(version: string): boolean {
  return version.split('.')[0] === '2'
}

function getLocalesRegex(localeCodes: string[]) {
  return new RegExp(`^/(${localeCodes.join('|')})(?:/|$)`, 'i')
}

export function createLocaleFromRouteGetter(
  localeCodes: string[],
  routesNameSeparator: string,
  defaultLocaleRouteNameSuffix: string
) {
  const localesPattern = `(${localeCodes.join('|')})`
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
  const regexpName = new RegExp(
    `${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`,
    'i'
  )
  const regexpPath = getLocalesRegex(localeCodes)

  /**
   * Extract locale code from given route:
   * - If route has a name, try to extract locale from it
   * - Otherwise, fall back to using the routes'path
   * @param  {import('vue-router').Route} route
   * @return {string} Locale code found if any
   */
  // TODO: should be implement for nuxt3
  const getLocaleFromRoute = (route: Route): string => {
    // Extract from route name
    if (route.name) {
      const matches = route.name.match(regexpName)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    } else if (route.path) {
      // Extract from path
      const matches = route.path.match(regexpPath)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    }

    return ''
  }

  return getLocaleFromRoute
}
