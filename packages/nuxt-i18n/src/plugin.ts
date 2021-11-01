import { defineNuxtPlugin } from '#app'

import type { NuxtApp } from '#app'
import type { I18n } from 'vue-i18n-bridge'

export default defineNuxtPlugin(async (nuxt: NuxtApp) => {
  console.log('nuxt plugin', nuxt)
  const { nuxt2Context, vueApp } = nuxt
  const { i18n } = nuxt2Context
  console.log('i18n', i18n)

  // @ts-ignore
  nuxt.hook('i18n:legacy:ready', i18n => {
    console.log('i18n:legacy:ready hook', i18n)
    if ((i18n as I18n).mode === 'composition') {
      vueApp.use(i18n)
    }
  })
})
