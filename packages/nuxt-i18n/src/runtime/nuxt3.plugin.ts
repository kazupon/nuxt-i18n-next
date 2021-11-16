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

export default defineNuxtPlugin(async nuxt => {
  const { vueApp: app } = nuxt
  console.log('nuxt-i18n: nuxt.js v3.x', nuxt)

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
    locale: 'en',
    ...nuxtI18nOptions.vueI18n
  })

  i18n.localeCodes = localeCodes
  i18n.locales = nuxtI18nOptions.locales

  // install i18n instance to vue
  app.use(i18n)

  // inject i18n instance to nuxt
  nuxt.provide('i18n', i18n)
})
