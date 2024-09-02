<template>
  <router-view v-slot="Component">
    <component :is="components || Component" />
  </router-view>
</template>

<script setup name="BlankLayoutPage" lang="ts">
import { useRoute } from 'vue-router'
import {computed} from "vue";

const route = useRoute()

const components = computed(() => {
  const componentName = route.matched[route.matched.length - 1]?.components?.default?.name
  if (componentName !== 'BlankLayoutPage') {
    return route.matched[route.matched.length - 1]?.components?.default
  }
  return undefined
})


</script>

<style scoped>

</style>
