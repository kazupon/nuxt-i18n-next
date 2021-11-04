import { isBoolean, isObject } from '@intlify/shared'

import type { NuxtOptions, Nuxt } from '@nuxt/kit'

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
