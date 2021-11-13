import Vue from 'vue2'
import VueI18n from 'vue-i18n-legacy'
import { createI18n } from 'vue-i18n-bridge'
import { isEmptyObject } from '@intlify/shared'
import { defineNuxtPlugin } from '#app'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// TODO:
import {
  messages,
  localeCodes,
  nuxtI18nOptions
  // @ts-ignore: resolved with tsconfig
} from '#build/nuxti18n.loader'

export default defineNuxtPlugin(async nuxt => {
  // vue-i18n install to vue
  Vue.use(VueI18n, { bridge: true })

  // TODO: lazy load
  // load messages
  if (!isEmptyObject(messages)) {
    nuxtI18nOptions.vueI18n.messages = messages
  }

  // create i18n instance with vue-i18n-bridge
  const i18n = createI18n(
    {
      legacy: false,
      globalInjection: true,
      locale: 'en',
      ...nuxtI18nOptions.vueI18n
    },
    VueI18n
  )

  i18n.localeCodes = localeCodes

  // @ts-ignore
  // install i18n instance to vue
  Vue.use(i18n)

  // inject i18n instance to nuxt
  nuxt.provide('i18n', i18n)
})

declare module 'vue-i18n-bridge' {
  interface I18n {
    localeCodes: string[]
  }
}
