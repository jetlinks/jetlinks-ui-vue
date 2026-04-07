<template>
  <img :src="src" />
</template>

<script setup>
import { configImages } from '@rule-engine-manager-ui/assets/index';
defineOptions({
  name: 'LevelIcon'
})

const props = defineProps({
  level: {
    type: Number,
    default: undefined
  }
})

const src = computed(() => {
  return configImages.alarm[props.level - 1]
})


</script>

<style scoped>

</style>
