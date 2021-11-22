import {
  isBoolean,
  isObject,
  isString,
  isRegExp,
  isFunction,
  isArray
} from '@intlify/shared'
import { parse } from 'pathe'
import { promises as fs } from 'fs'
import { resolveFiles } from '@nuxt/kit'

import type { NuxtI18nOptions, LocaleObject, LocaleInfo } from './types'
import type { Nuxt, NuxtOptions } from '@nuxt/schema'

export function getNormalizedLocales(
  locales: NuxtI18nOptions['locales']
): LocaleObject[] {
  locales = locales || []
  const normalized: LocaleObject[] = []
  for (const locale of locales) {
    if (isString(locale)) {
      normalized.push({ code: locale })
    } else {
      normalized.push(locale)
    }
  }
  return normalized
}

export async function resolveLocales(
  path: string,
  locales: LocaleObject[]
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
  locales: NonNullable<NuxtI18nOptions['locales']>,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringifyObj(obj: Record<string, any>): string {
  return `Object({${Object.entries(obj)
    .map(([key, value]) => `${JSON.stringify(key)}:${toCode(value)}`)
    .join(`,`)}})`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCode(code: any): string {
  if (code === null) {
    return `null`
  }

  if (code === undefined) {
    return `undefined`
  }

  if (isString(code)) {
    return JSON.stringify(code)
  }

  if (isRegExp(code) && code.toString) {
    return code.toString()
  }

  if (isFunction(code) && code.toString) {
    return `(${code.toString()})`
  }

  if (isArray(code)) {
    return `[${code.map(c => toCode(c)).join(`,`)}]`
  }

  if (isObject(code)) {
    return stringifyObj(code)
  }

  return code + ``
}
