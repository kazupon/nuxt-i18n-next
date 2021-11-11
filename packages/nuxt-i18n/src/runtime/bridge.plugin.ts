import Vue from 'vue2'
import VueI18n from 'vue-i18n8'
import { createI18n } from 'vue-i18n-bridge'
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
  const { vueApp } = nuxt
  // console.log('nuxt2Context', nuxt2Context)

  const loadedOptions = await optionsLoader()
  if (!isEmpty(messages)) {
    loadedOptions.messages = messages
  }
  console.log('loadedOptions', loadedOptions)

  Vue.use(VueI18n, { bridge: true })
  console.log('plugin installed i18n')

  const i18n = createI18n(
    {
      legacy: false,
      globalInjection: true,
      locale: 'en',
      ...loadedOptions
    },
    VueI18n
  )

  // @ts-ignore
  Vue.use(i18n)
  console.log('plugin installed bridge i18n')

  nuxt.hook('app:created', () => {
    console.log('app:created')
  })
  nuxt.hook('app:beforeMount', () => {
    console.log('app:beofreMount')
  })
  nuxt.hook('app:mounted', () => {
    console.log('app:mounted')
  })

  nuxt.i18n = i18n
  console.log('set i18n to nuxt')
})
