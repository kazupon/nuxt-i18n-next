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
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const availableLocales = computed(() => {
      return [{
        code: 'en',
        name: 'English'
      }, {
        code: 'ja',
        name: '日本語'
      }]
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

