import { createI18n } from 'vue-i18n'
import { defineNuxtPlugin } from '#app'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import optionsLoader from '#build/nuxti18n.options.mjs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import messages from '#build/nuxti18n.locales.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEmpty = (obj: any) => Object.keys(obj).length === 0

export default defineNuxtPlugin(async nuxt => {
  const { vueApp: app } = nuxt
  console.log('nuxt-i18n: nuxt.js v3.x', nuxt)

  const loadedOptions = await optionsLoader()
  if (!isEmpty(messages)) {
    loadedOptions.messages = messages
  }

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    ...loadedOptions
  })

  app.use(i18n)

  nuxt.i18n = i18n
})
