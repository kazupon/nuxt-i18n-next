import Vue from 'vue2'
import VueI18n from 'vue-i18n-legacy'
import { createI18n } from 'vue-i18n-bridge'
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

import type { Route } from 'vue-router3'

const getLocaleFromRoute = createLocaleFromRouteGetter(
  localeCodes,
  nuxtI18nOptions.routesNameSeparator,
  nuxtI18nOptions.defaultLocaleRouteNameSuffix
)

export default defineNuxtPlugin(async nuxt => {
  console.log('plugin setup', nuxt)

  // @ts-ignore
  const route = useRoute() as Route
  console.log('route', route)
  const routeLocale = getLocaleFromRoute(route) || 'en'
  console.log('routelocale', routeLocale)

  // vue-i18n install to vue
  Vue.use(VueI18n, { bridge: true })

  // TODO: lazy load
  // load messages
  const messages = await loadMessages()
  if (!isEmptyObject(messages)) {
    nuxtI18nOptions.vueI18n.messages = messages
  }

  // create i18n instance with vue-i18n-bridge
  const i18n = createI18n(
    {
      legacy: false,
      globalInjection: true,
      locale: routeLocale || nuxtI18nOptions.defaultLocale,
      ...nuxtI18nOptions.vueI18n
    },
    VueI18n
  )

  async function onNavigate(
    route: Route
  ): Promise<[number | null, string | null, boolean?]> {
    // NOTE: for demo only
    if (process.client) {
      window.parent.postMessage(
        { source: 'bridge', url: window.location.href },
        '*'
      )
    }

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
  i18n.__onNavigate = onNavigate
  i18n.setLocale = setLocale

  // @ts-ignore
  // install i18n instance to vue
  Vue.use(i18n)

  // inject i18n instance to nuxt
  nuxt.provide('i18n', i18n)
})
