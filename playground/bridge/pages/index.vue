<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">
      {{ locale.name }} |
    </nuxt-link>
    <h3>{{ t('hello', { name: 'Nuxt' }) }}</h3>
  </div>
</template>

<script lang="ts">
import { useI18n } from '~i18n-bridge' // TODO: should change to `vue-i18n-bridge` and auto importing!

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { nuxt2Context } = useNuxtApp()

    const availableLocales = computed(() => {
      return nuxt2Context.i18n.locales.filter(i => i.code !== nuxt2Context.i18n.global.locale.value)
    })

    return { availableLocales, t }
  }
})

/*
export default Vue.extend({
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  }
})
*/
</script>

