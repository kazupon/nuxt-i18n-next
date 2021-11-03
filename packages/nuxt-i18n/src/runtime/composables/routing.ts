import { isVue2 } from '../utils'
import { useNuxtApp } from '#app'

export function useI18nRouting() {
  const { vueApp } = useNuxtApp()

  // TODO: should switch to vue-demi
  if (isVue2(vueApp.version)) {
    console.log('vue2 routing composition api')
  } else {
    // TODO: vue3
    console.log('vue3 routing composition api')
  }

  // TODO
  return {}
}
