import { defineNuxtModule, isNuxt2, installModule } from '@nuxt/kit'

import type { Options } from '@nuxtjs/i18n'
export type NuxtI18nNextOptions = Options

const NuxtI18nModule = defineNuxtModule<NuxtI18nNextOptions>({
  name: '@kazupon/nuxt-i18n-next',
  configKey: 'i18n',
  defaults: {},
  async setup(options, nuxt) {
    console.log('setup isNuxt2?', isNuxt2(nuxt))
    if (isNuxt2(nuxt)) {
      await installModule(nuxt, require.resolve('@nuxtjs/i18n'))
    }
  }
})

export default NuxtI18nModule
