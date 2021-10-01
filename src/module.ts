import { defineNuxtModule, isNuxt2, installModule } from '@nuxt/kit'

import type { Options } from '@nuxtjs/i18n'
export type NuxtI18nNextOptions = Options

const IntlifyModule = defineNuxtModule<NuxtI18nNextOptions>({
  name: '@kazupon/nuxt-i18n-next',
  configKey: 'i18n',
  defaults: {},
  async setup(options, nuxt) {
    if (isNuxt2(nuxt)) {
      await installModule(nuxt, require.resolve('@nuxtjs/i18n'))
    }
  }
})

export default IntlifyModule
