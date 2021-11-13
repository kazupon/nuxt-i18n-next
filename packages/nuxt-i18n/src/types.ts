import type { Options, LocaleObject } from '@nuxtjs/i18n'

export type { LocaleObject, LazyOptions } from '@nuxtjs/i18n'
export type NuxtI18nOptions = Options

export type LocaleInfo = {
  path: string
} & LocaleObject

export interface I18nHeadOptions {
  addDirAttribute?: boolean
  addSeoAttributes?: boolean
}

// TODO: should extend NuxtApp (nuxt3) with declare module
/*
declare module 'nuxt3' {
  interface NuxtApp {
    i18n: I18n
  }
}
*/
