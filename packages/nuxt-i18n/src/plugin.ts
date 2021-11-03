import { defineNuxtPlugin } from '#app'

import type { NuxtApp } from '#app'
import type { I18n } from 'vue-i18n-bridge'

export default defineNuxtPlugin(async (nuxt: NuxtApp) => {
  const { nuxt2Context, vueApp } = nuxt
  // console.log('nuxt2Context', nuxt2Context)
  console.log('isClient', nuxt2Context.isClient)

  // @ts-ignore
  nuxt.hook('i18n:legacy:ready', i18n => {
    console.log('i18n:legacy:ready hook')
    if ((i18n as I18n).mode === 'composition') {
      vueApp.use(i18n)
    }
  })
})
