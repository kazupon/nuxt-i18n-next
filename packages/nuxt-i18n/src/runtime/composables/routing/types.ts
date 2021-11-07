import type { Options, LocaleObject } from '@nuxtjs/i18n'

export type I18nRoutingOptions = Partial<
  Pick<
    Options,
    | 'defaultLocale'
    | 'strategy'
    | 'vuex'
    | 'routesNameSeparator'
    | 'defaultLocaleRouteNameSuffix'
  >
> & {
  normalizedLocales?: readonly LocaleObject[]
  trailingSlash?: boolean
  ssrContext?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}
