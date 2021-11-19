import { createI18n } from 'vue-i18n'
import { isEmptyObject } from '@intlify/shared'
import { defineNuxtPlugin } from '#app'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// TODO:
import {
  messages as loadMessages,
  localeCodes,
  nuxtI18nOptions
  // @ts-ignore: resolved with tsconfig
} from '#build/nuxti18n.loader'
// @ts-ignore: resolved with tsconfig
import { createLocaleFromRouteGetter } from '#i18n'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

const getLocaleFromRoute = createLocaleFromRouteGetter(
  localeCodes,
  nuxtI18nOptions.routesNameSeparator,
  nuxtI18nOptions.defaultLocaleRouteNameSuffix
)

export default defineNuxtPlugin(async nuxt => {
  const { vueApp: app, $router } = nuxt
  console.log('main plugin')

  const route = $router.currentRoute
  console.log('route', route, $router)
  const routeLocale = route ? getLocaleFromRoute(route.value) : 'en'
  console.log('routelocale', routeLocale)

  // TODO: lazy load
  // load messages
  const messages = await loadMessages()
  if (!isEmptyObject(messages)) {
    nuxtI18nOptions.vueI18n.messages = messages
  }

  // create i18n instance with vue-i18n-bridge
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: routeLocale || nuxtI18nOptions.defaultLocale,
    ...nuxtI18nOptions.vueI18n
  })

  async function onNavigate(
    route: RouteLocationNormalizedLoaded
  ): Promise<[number | null, string | null, boolean?]> {
    // TODO: should be more implementation
    const finalLocale =
      getLocaleFromRoute(route) || i18n.locale || i18n.defaultLocale || ''
    console.log('onNavigate finalLocale', finalLocale)
    await i18n.setLocale(finalLocale)
    return [null, null, undefined]
  }

  async function setLocale(locale: string) {
    // TODO: should be more implementation
    i18n.global.locale.value = locale
  }

  i18n.locale = i18n.global.locale.value
  i18n.defaultLocale = nuxtI18nOptions.defaultLocale
  i18n.localeCodes = localeCodes
  i18n.locales = nuxtI18nOptions.locales
  i18n.setLocale = setLocale

  // install i18n instance to vue
  app.use(i18n)

  // inject i18n instance to nuxt
  nuxt.provide('i18n', i18n)

  // @ts-ignore
  watch(
    () => $router.currentRoute.value.path,
    async (val: string) => {
      console.log('chagne route path', val)
      if (val == null) {
        return
      }
      const nextRoute = $router.currentRoute.value

      // NOTE: for demo only
      window.parent.postMessage(
        { source: 'nuxt3', url: window.location.href },
        '*'
      )

      console.log('current route', nextRoute)
      const [status, redirectPath, preserveQuery] = await onNavigate(nextRoute)
      // if (status && redirectPath) {
      //   const query = preserveQuery ? maybeNextRoute.query : undefined
      //   // TODO: should be more implementation
      //   console.log(`redirect to ${query}`)
      // }
    }
  )
})
