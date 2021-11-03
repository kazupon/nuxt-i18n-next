<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">
      {{ locale.name }} |
    </nuxt-link>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const { nuxt2Context } = useNuxtApp()

    const availableLocales = computed(() => {
      return nuxt2Context.i18n.locales.filter(i => i.code !== nuxt2Context.i18n.global.locale.value)
    })

    return { availableLocales }
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

