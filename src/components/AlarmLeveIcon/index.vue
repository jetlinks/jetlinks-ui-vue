<template>
  <img :src="src" />
</template>

<script setup>

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
  return `/images/alarm/alarm${props.level}.png`
})


</script>

<style scoped>

</style>
