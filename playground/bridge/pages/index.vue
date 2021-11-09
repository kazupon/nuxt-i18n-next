<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <span v-for="locale in availableLocales" :key="locale.code">
      <NuxtLink :to="switchLocalePath(locale.code) || ''">{{ locale.name }}</NuxtLink> |
    </span>
    <h3>{{ t('hello', { name: 'Nuxt' }) }}</h3>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n-bridge'
import { useNuxtI18n } from '#i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { switchLocalePath, localePath } = useNuxtI18n()
    const { nuxt2Context } = useNuxtApp()

    console.log('localPath', localePath('/about', 'fr'))
    const availableLocales = computed(() => {
      return nuxt2Context.i18n.locales.filter(i => i.code !== nuxt2Context.i18n.global.locale.value)
    })

    return { switchLocalePath, availableLocales, t }
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

