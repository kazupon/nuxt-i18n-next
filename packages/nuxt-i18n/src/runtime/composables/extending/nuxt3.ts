export function useI18nExtendingNuxt3() {
  console.log('nuxt3 extending composition api')

  function getLocaleCookie() {
    // TODO: implementation with `@vueuse/integrations/useCookies`
    // https://vueuse.org/integrations/useCookies/
  }

  function setLocaleCookie() {
    // TODO: implementation with `@vueuse/integrations/useCookies`
    // https://vueuse.org/integrations/useCookies/
  }

  function setLocale() {
    // TODO:
  }

  function getBrowserLocale() {
    // TODO:
  }

  // TODO: ...
  // https://i18n.nuxtjs.org/api/#extension-of-vuei18n

  return {
    getLocaleCookie,
    setLocaleCookie,
    setLocale,
    getBrowserLocale
  }
}
