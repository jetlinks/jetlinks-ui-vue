<template>
  <div class="title" :style='style'>
    <div class="title-before"></div>
    <span>{{ data }}</span>
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang='ts' name='TitleComponent'>
import type { CSSProperties, PropType } from 'vue'

const props = defineProps({
  data: {
    type: String,
    default: ""
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  }
})

</script>

<style lang="less" scoped>

.title {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
  font-size: 16px;
}
.title-before {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: calc(100% - 2px);
  background-color: @primary-color;
  border-radius: 0 3px 3px 0;
}
</style>