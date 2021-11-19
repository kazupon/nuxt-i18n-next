<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  name?: string
  url?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: 'name1',
  url: 'https://v3.vuejs.org'
})

const viewURL = ref(props.url)
const iframeURL = ref(props.url)
const content = ref<HTMLIFrameElement | null>(null)

onMounted(() => {
  window.addEventListener('message', event => {
    console.log('review', event, event.data)
    if (event.data.source === props.name) {
      viewURL.value = event.data.url
    }
  });
})
</script>

<template>
  <div class="page-url">
    <form>
      <label :for="name">
        <input :name="name" :value="viewURL" />
      </label>
    </form>
  </div>
  <div class="page-content">
    <iframe ref="content" :src="iframeURL"></iframe>
  </div>
</template>

<style scoped>
.page-url {
  display: flex;
  height: var(--header-height);
}

.page-url form {
  padding: 0px;
  width: 100%;
  height: var(--header-height);
  flex-grow: 1;
  margin-right: 0px;
}

.page-url label {
  display: flex;
  align-items: center;
  overflow-x: hidden;
  height: 100%;
}

.page-url input {
  width: 100%;
  height: 100%;
  padding-left: 6px;
  border: none;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  outline: none;
}

.page-content{
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}

.page-content iframe {
  border: none;
  height: 100%;
  width: 100%;
}
</style>