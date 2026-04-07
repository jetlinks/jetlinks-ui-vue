<template>
  <div class='title-content'>
    <div class='title'>
      <j-ellipsis :lineClamp="2">
        {{ data.name }}
      </j-ellipsis>
    </div>
    <div class='header-title-type'>
      <ResourceType :type='data.type' />
    </div>
  </div>
</template>

<script setup name='DetailHeaderTitle'>
import ResourceType from './ResourceType.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang='less' scoped>
.title-content {
  width: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  .header-title-type {
    width: 100px;
    white-space: nowrap;
  }
}
</style>
