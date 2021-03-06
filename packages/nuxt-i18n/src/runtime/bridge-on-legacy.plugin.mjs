import Vue from 'vue2'
import { createI18n } from 'vue-i18n-bridge'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async nuxt => {
  const { nuxt2Context } = nuxt
  console.log('nuxt2Context', nuxt2Context)

  // @ts-ignore
  nuxt.hook('i18n:legacy:ready', i18n => {
    console.log('i18n:legacy:ready hook')
    if (i18n.mode === 'composition') {
      Vue.use(i18n)
    }
  })
})
