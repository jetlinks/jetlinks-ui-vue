<template>
  <j-page-container>
    <iframe
      :src="iframeUrl"
      frameBorder="0"
      style="width: 100%; height: calc(100vh - 140px)"
    ></iframe>
  </j-page-container>
</template>

<script setup name="IframePage" lang="ts">
import { ref } from 'vue'
const iframeUrl = ref('')

</script>

<style scoped>

</style>
