<template>
  <div ref="domRef" class="dom-item">
    <slot name="item"></slot>
  </div>
</template>

<script setup>
const emit = defineEmits(['onSizeChange']);

const domRef = ref(null);
const resizeObserver = null;

onMounted(() => {
  emit("onSizeChange", domRef.value);
  const resizeObserver = new ResizeObserver(() => {
    emit("onSizeChange", domRef.value);
  });
  resizeObserver.observe(domRef.value);
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver?.unobserve(domRef.value);
  }
})
</script>

<style scoped>
.dom-item {
  padding-bottom: 1rem;
  box-sizing: border-box;
}
</style>
