import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    '@kazupon/nuxt-i18n-next'
  ],

  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        file: 'en.json',
        name: 'English'
      },
      {
        code: 'ja',
        file: 'ja.json',
        name: 'Japanses'
      },
      {
        code: 'fr',
        file: 'fr.json',
        name: 'Français'
      }
    ],
    defaultLocale: 'ja',
    vueI18n: {
      legacy: false,
      fallbackLocale: 'en'
    },
  },
})
