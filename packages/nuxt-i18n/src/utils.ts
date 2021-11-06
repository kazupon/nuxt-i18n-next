import { isBoolean, isObject } from '@intlify/shared'
import { parse } from 'pathe'
import { promises as fs } from 'fs'
import { resolveFiles } from '@nuxt/kit'

import type { NuxtOptions, Nuxt } from '@nuxt/kit'
import type { NuxtI18nNextOptions } from './types'
import type { LocaleObject } from '@nuxtjs/i18n'

export type LocaleInfo = {
  path: string
} & LocaleObject

export async function resolveLocales(
  path: string,
  locales: NonNullable<NuxtI18nNextOptions['locales']>
): Promise<LocaleInfo[]> {
  const files = await resolveFiles(path, '**/*{json,json5,yaml,yml}')
  return files.map(file => {
    const parsed = parse(file)
    const locale = findLocales(locales, parsed.base)
    return locales == null
      ? {
          path: file,
          file: parsed.base,
          code: parsed.name
        }
      : Object.assign({ path: file }, locale)
  })
}

function findLocales(
  locales: NonNullable<NuxtI18nNextOptions['locales']>,
  filename: string
) {
  // @ts-ignore
  const ret = locales.find(
    (locale: string | LocaleObject) =>
      isObject(locale) && locale.file === filename
  )
  return ret != null ? (ret as LocaleObject) : null
}

export function isViteMode(options: NuxtOptions): boolean {
  return options.vite != null
    ? isBoolean(options.vite)
      ? options.vite
      : isObject(options.vite)
    : true
}

export function setupAliasTranspileOptions(
  nuxt: Nuxt,
  name: string,
  entry: string
): void {
  nuxt.options.alias[name] = entry
  isViteMode(nuxt.options) && nuxt.options.build.transpile.push(name)
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch (e) {
    return false
  }
}
